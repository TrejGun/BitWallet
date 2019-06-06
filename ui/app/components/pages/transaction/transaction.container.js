import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import ConfirmTransaction from "./transaction.component";
import {
  buyEthView,
  cancelAllTx,
  cancelMsg,
  cancelPersonalMsg,
  cancelTx,
  cancelTypedMsg,
  showModal,
  signMsg,
  signPersonalMsg,
  signTypedMsg,
  updateAndApproveTx,
} from "../../../actions";
import {getConversionRate, getCurrentCurrency, getCurrentNetwork, getSelectedAddress} from "../../../selectors";


function mapStateToProps ({metamask, send, appState}) {
  return {
    send,
    identities: metamask.identities,
    accounts: metamask.accounts,
    selectedAddress: getSelectedAddress(metamask),
    unapprovedTxs: metamask.unapprovedTxs,
    unapprovedMsgs: metamask.unapprovedMsgs,
    unapprovedPersonalMsgs: metamask.unapprovedPersonalMsgs,
    unapprovedTypedMessages: metamask.unapprovedTypedMessages,
    index: 0, // TODO FIXME
    warning: appState.warning,
    network: getCurrentNetwork(metamask),
    provider: metamask.provider,
    conversionRate: getConversionRate(metamask),
    currentCurrency: getCurrentCurrency(metamask),
    blockGasLimit: metamask.currentBlockGasLimit,
    computedBalances: metamask.computedBalances,
    unapprovedMsgCount: metamask.unapprovedMsgCount,
    unapprovedPersonalMsgCount: metamask.unapprovedPersonalMsgCount,
    unapprovedTypedMessagesCount: metamask.unapprovedTypedMessagesCount,
    selectedAddressTxList: metamask.selectedAddressTxList,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    showModal: () => dispatch(showModal({
      name: "TRANSACTION_CONFIRMED",
      // onHide: () => history.push(DEFAULT_ROUTE),
    })),
    buyEthView: (address) => dispatch(buyEthView(address)),
    updateAndApproveTx: (txData) => dispatch(updateAndApproveTx(txData)),
    cancelTx: (txData) => dispatch(cancelTx(txData)),
    cancelAllTx: (unconfTxList) => dispatch(cancelAllTx(unconfTxList)),
    signMsg: (params) => dispatch(signMsg(params)),
    signPersonalMsg: (params) => dispatch(signPersonalMsg(params)),
    signTypedMsg: (params) => dispatch(signTypedMsg(params)),
    cancelMsg: (msgData) => dispatch(cancelMsg(msgData)),
    cancelPersonalMsg: (msgData) => dispatch(cancelPersonalMsg(msgData)),
    cancelTypedMsg: (msgData) => dispatch(cancelTypedMsg(msgData)),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmTransaction);
