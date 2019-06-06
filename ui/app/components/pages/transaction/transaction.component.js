import React, {Component} from "react";
import PropTypes from "prop-types";
import txHelper from "../../../../lib/tx-helper";
import log from "loglevel";
import R from "ramda";
import PendingTx from "./pending/index";
import SignatureRequest from "./signature-request";
import Loading from "../../loading-screen";
import {DEFAULT_ROUTE} from "../../../routes";


export default class ConfirmTransaction extends Component {

  static propTypes = {
    unapprovedMsgCount: PropTypes.number,
    unapprovedPersonalMsgCount: PropTypes.number,
    unapprovedTypedMessagesCount: PropTypes.number,
    unapprovedTxs: PropTypes.object,
    network: PropTypes.string,
    send: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    selectedAddressTxList: PropTypes.array,
    showModal: PropTypes.func,
    buyEthView: PropTypes.func,
    cancelTx: PropTypes.func,
    cancelAllTx: PropTypes.func,
    cancelPersonalMsg: PropTypes.func,
    signMsg: PropTypes.func,
    cancelMsg: PropTypes.func,
    signTypedMsg: PropTypes.func,
    signPersonalMsg: PropTypes.func,
    cancelTypedMsg: PropTypes.func,
    updateAndApproveTx: PropTypes.func,
    index: PropTypes.number,
    unapprovedMsgs: PropTypes.object,
    unapprovedPersonalMsgs: PropTypes.object,
    unapprovedTypedMessages: PropTypes.object,
    currentCurrency: PropTypes.string,
    conversionRate: PropTypes.number,
    blockGasLimit: PropTypes.string,
    selectedAddress: PropTypes.string,
    accounts: PropTypes.object,
    identities: PropTypes.object,
  };

  static defaultProps = {
    unapprovedMsgCount: 0,
    unapprovedPersonalMsgCount: 0,
    unapprovedTypedMessagesCount: 0,
    unapprovedTxs: {},
  };

  getUnapprovedMessagesTotal () {
    const {
      unapprovedMsgCount,
      unapprovedPersonalMsgCount,
      unapprovedTypedMessagesCount,
    } = this.props;

    return unapprovedTypedMessagesCount + unapprovedMsgCount + unapprovedPersonalMsgCount;
  }

  componentDidMount () {
    const {
      unapprovedTxs = {},
      network,
      send,
      history,
    } = this.props;
    const unconfTxList = txHelper(unapprovedTxs, {}, {}, {}, network);

    if (unconfTxList.length === 0 && !send.to && this.getUnapprovedMessagesTotal() === 0) {
      history.push(DEFAULT_ROUTE);
    }
  }

  componentDidUpdate (prevProps) {
    const {
      unapprovedTxs,
      network,
      selectedAddressTxList,
      send,
      history,
      match: {params: {id: transactionId} = {}},
      showModal,
    } = this.props;

    let prevTx;

    if (transactionId) {
      prevTx = R.find(({id}) => id + "" === transactionId)(selectedAddressTxList);
    } else {
      const {index: prevIndex, unapprovedTxs: prevUnapprovedTxs} = prevProps;
      const prevUnconfTxList = txHelper(prevUnapprovedTxs, {}, {}, {}, network);
      const prevTxData = prevUnconfTxList[prevIndex] || {};
      prevTx = selectedAddressTxList.find(({id}) => id === prevTxData.id) || {};
    }

    const unconfTxList = txHelper(unapprovedTxs, {}, {}, {}, network);

    if (prevTx.status === "dropped") {
      showModal({
        name: "TRANSACTION_CONFIRMED",
        onHide: () => history.push(DEFAULT_ROUTE),
      });

      return;
    }

    if (unconfTxList.length === 0 && !send.to && this.getUnapprovedMessagesTotal() === 0) {
      this.props.history.push(DEFAULT_ROUTE);
    }
  }

  getTxData () {
    const {
      network,
      index,
      unapprovedTxs,
      unapprovedMsgs,
      unapprovedPersonalMsgs,
      unapprovedTypedMessages,
      match: {params: {id: transactionId} = {}},
    } = this.props;

    const unconfTxList = txHelper(
      unapprovedTxs,
      unapprovedMsgs,
      unapprovedPersonalMsgs,
      unapprovedTypedMessages,
      network,
    );

    log.info(`rendering a combined ${unconfTxList.length} unconf msgs & txs`);

    return transactionId
      ? R.find(({id}) => id + "" === transactionId)(unconfTxList)
      : unconfTxList[index];
  }

  render () {
    const {
      currentCurrency,
      conversionRate,
      blockGasLimit,
      selectedAddress,
      accounts,
      identities,
    } = this.props;

    const txData = this.getTxData() || {};
    const txParams = txData.params || {};

    return this.currentTxView({
      // Properties
      txData,
      key: txData.id,
      selectedAddress,
      accounts,
      identities,
      conversionRate,
      currentCurrency,
      blockGasLimit,
      // Actions
      buyEth: this.buyEth.bind(this, txParams.from || selectedAddress),
      sendTransaction: this.sendTransaction.bind(this),
      cancelTransaction: this.cancelTransaction.bind(this, txData),
      signMessage: this.signMessage.bind(this, txData),
      signPersonalMessage: this.signPersonalMessage.bind(this, txData),
      signTypedMessage: this.signTypedMessage.bind(this, txData),
      cancelMessage: this.cancelMessage.bind(this, txData),
      cancelPersonalMessage: this.cancelPersonalMessage.bind(this, txData),
      cancelTypedMessage: this.cancelTypedMessage.bind(this, txData),
    });
  }

  currentTxView (opts) {
    log.info("rendering current tx view");
    const {txData} = opts;
    const {txParams, msgParams} = txData;

    if (txParams) {
      log.debug("txParams detected, rendering pending tx");
      return <PendingTx {...opts} />;
    } else if (msgParams) {
      log.debug("msgParams detected, rendering pending msg");
      return <SignatureRequest {...opts} />;
    }

    return <Loading />;
  }

  buyEth (address, event) {
    event.preventDefault();
    const {buyEthView} = this.props;
    buyEthView(address);
  }

  sendTransaction (txData) {
    const {updateAndApproveTx, history} = this.props;
    updateAndApproveTx(txData)
      .then(() => history.push(DEFAULT_ROUTE));
  }

  cancelTransaction (txData, event) {
    this.stopPropagation(event);
    event.preventDefault();
    const {cancelTx} = this.props;
    cancelTx(txData);
  }

  cancelAllTransactions (unconfTxList, event) {
    this.stopPropagation(event);
    event.preventDefault();
    const {cancelAllTx} = this.props;
    cancelAllTx(unconfTxList);
  }

  signMessage (msgData, event) {
    this.stopPropagation(event);
    const {signMsg} = this.props;
    log.info("conf-tx.component.js: signing message");
    const params = msgData.msgParams;
    params.metamaskId = msgData.id;
    return signMsg(params);
  }

  stopPropagation (e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  }

  signPersonalMessage (msgData, event) {
    this.stopPropagation(event);
    log.info("conf-tx.component.js: signing personal message");
    const {signPersonalMsg} = this.props;
    const params = msgData.msgParams;
    params.metamaskId = msgData.id;
    return signPersonalMsg(params);
  }

  signTypedMessage (msgData, event) {
    this.stopPropagation(event);
    log.info("conf-tx.component.js: signing typed message");
    const {signTypedMsg} = this.props;
    const params = msgData.msgParams;
    params.metamaskId = msgData.id;
    return signTypedMsg(params);
  }

  cancelMessage (msgData, event) {
    this.stopPropagation(event);
    log.info("canceling message");
    const {cancelMsg} = this.props;
    return cancelMsg(msgData);
  }

  cancelPersonalMessage (msgData, event) {
    this.stopPropagation(event);
    log.info("canceling personal message");
    const {cancelPersonalMsg} = this.props;
    return cancelPersonalMsg(msgData);
  }

  cancelTypedMessage (msgData, event) {
    this.stopPropagation(event);
    log.info("canceling typed message");
    const {cancelTypedMsg} = this.props;
    return cancelTypedMsg(msgData);
  }
}
