import React, {Component} from "react";
import PropTypes from "prop-types";
import {clone} from "lodash";
import abi from "human-standard-token-abi";
import abiDecoder from "abi-decoder";
import {getSymbolAndDecimals} from "../../../../token-util";
import ConfirmSendEther from "./send-ether";
import ConfirmSendToken from "./send-token";
import ConfirmDeployContract from "./deploy-contract";
import Loading from "../../../loading-screen";

abiDecoder.addABI(abi);


const TX_TYPES = {
  DEPLOY_CONTRACT: "deploy_contract",
  SEND_ETHER: "send_ether",
  SEND_TOKEN: "send_token",
};

export default class PendingTransaction extends Component {

  static propTypes = {
    tokens: PropTypes.array,
    sendTransaction: PropTypes.func,
    txData: PropTypes.object,
  };

  state = {
    isFetching: true,
    transactionType: "",
    tokenAddress: "",
    tokenSymbol: "",
    tokenDecimals: "",
  };

  componentDidMount () {
    this.setTokenData();
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.isFetching) {
      this.setTokenData();
    }
  }

  async setTokenData () {
    const {tokens} = this.props;
    const txMeta = this.gatherTxMeta();
    const txParams = txMeta.txParams || {};

    if (txMeta.loadingDefaults) {
      return;
    }

    if (!txParams.to) {
      return this.setState({
        transactionType: TX_TYPES.DEPLOY_CONTRACT,
        isFetching: false,
      });
    }

    // inspect tx data for supported special confirmation screens
    let isTokenTransaction = false;
    if (txParams.data) {
      const tokenData = abiDecoder.decodeMethod(txParams.data);
      const {name: tokenMethodName} = tokenData || {};
      isTokenTransaction = (tokenMethodName === "transfer");
    }

    if (isTokenTransaction) {
      const {symbol, decimals} = await getSymbolAndDecimals(txParams.to, tokens);
      console.log("TOKEN", symbol, decimals);


      this.setState({
        transactionType: TX_TYPES.SEND_TOKEN,
        tokenAddress: txParams.to,
        tokenSymbol: symbol,
        tokenDecimals: decimals,
        isFetching: false,
      });
    } else {
      this.setState({
        transactionType: TX_TYPES.SEND_ETHER,
        isFetching: false,
      });
    }
  }

  gatherTxMeta () {
    const {txData: propsTxData} = this.props;
    const {txData: stateTxData} = this.state;
    const txData = clone(stateTxData) || clone(propsTxData);

    return txData;
  }

  render () {
    const {
      isFetching,
      transactionType,
      tokenAddress,
      tokenSymbol,
      tokenDecimals,
    } = this.state;

    const {sendTransaction} = this.props;

    if (isFetching) {
      return (
        <Loading loadingMessage="generatingTransaction" />
      );
    }

    switch (transactionType) {
      case TX_TYPES.SEND_ETHER:
        return (
          <ConfirmSendEther txData={this.gatherTxMeta()} sendTransaction={sendTransaction} />
        );
      case TX_TYPES.SEND_TOKEN:
        return (
          <ConfirmSendToken txData={this.gatherTxMeta()} sendTransaction={sendTransaction} token={{
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          }} />
        );
      case TX_TYPES.DEPLOY_CONTRACT:
        return (
          <ConfirmDeployContract txData={this.gatherTxMeta()} sendTransaction={sendTransaction} />
        );
      default:
        return (
          <Loading />
        );
    }
  }
}
