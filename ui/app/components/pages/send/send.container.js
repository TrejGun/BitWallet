import {connect} from "react-redux";
import {compose} from "recompose";
import {
  accountsWithSendEtherInfoSelector,
  getAmountConversionRate,
  getBlockGasLimit,
  getConversionRate,
  getFromBalance,
  getCurrentCurrency,
  getCurrentNetwork,
  getGasIsLoading,
  getPrimaryCurrency,
  getRecentBlocks,
  getSelectedAddress,
  getSelectedToken,
  getSelectedTokenContract,
  getSendToAccounts,
  getTokenBalance,
  getUnapprovedTxs,
} from "../../../selectors";
import {
  calcGasTotal,
  calcTokenBalance,
  addressIsNew,
  constructTxParams,
  constructUpdatedTx,
} from "./send.utils";
import {
  addToAddressBook,
  setTokenBalance,
  signTokenTx,
  signTx,
  updateGasData,
  updateTokenBalance,
  updateTransaction,
  updateSend,
  showModal,
} from "../../../actions";
import Send from "./send.component";
import withValidation from "../../form/withValidation";
import {withRouter} from "react-router-dom";
import ethUtil from "ethereumjs-util";
import {getSubtitleParams, getTitleParams} from "./send.selectors";


function mapStateToProps ({metamask, send, appState}) {
  return {
    send,
    amountConversionRate: getAmountConversionRate(metamask),
    balance: getFromBalance(metamask),
    blockGasLimit: getBlockGasLimit(metamask),
    conversionRate: getConversionRate(metamask),
    convertedCurrency: getCurrentCurrency(metamask),
    fromAccounts: accountsWithSendEtherInfoSelector(metamask),
    gasIsLoading: getGasIsLoading(appState),
    network: getCurrentNetwork(metamask),
    primaryCurrency: getPrimaryCurrency(metamask),
    recentBlocks: getRecentBlocks(metamask),
    selectedAddress: getSelectedAddress(metamask),
    selectedToken: getSelectedToken(metamask),
    toAccounts: getSendToAccounts(metamask),
    tokenContract: getSelectedTokenContract(metamask),
    titleParams: getTitleParams(metamask, send),
    subtitleParams: getSubtitleParams(metamask, send),
    unapprovedTxs: getUnapprovedTxs(metamask),
    tokenBalance: getTokenBalance(send),
  };
}

function mapDispatchToProps (dispatch) {
  return {
    showCustomizeGasModal: () => dispatch(showModal({name: "CUSTOMIZE_GAS"})),
    setTokenBalance: ({usersToken, selectedToken}) => {
      if (!usersToken) {
        return;
      }

      const tokenBalance = calcTokenBalance({usersToken, selectedToken});
      dispatch(setTokenBalance(tokenBalance));
    },
    updateTokenBalance: ({selectedToken, tokenContract, address}) => {
      return dispatch(updateTokenBalance({
        selectedToken,
        tokenContract,
        address,
      }));
    },
    updateAndSetGasTotal: ({blockGasLimit, editingTransactionId, gasLimit, gasPrice, recentBlocks, selectedAddress, selectedToken, to, value}) => {
      return editingTransactionId
        ? dispatch(() => Promise.resolve({gasTotal: calcGasTotal(gasLimit, gasPrice)}))
        : dispatch(updateGasData({recentBlocks, selectedAddress, selectedToken, blockGasLimit, to, value}));
    },
    addToAddressBookIfNew: (newAddress, toAccounts, nickname = "") => {
      const hexPrefixedAddress = ethUtil.addHexPrefix(newAddress);
      if (addressIsNew(toAccounts)) {
        // TODO: nickname, i.e. addToAddressBook(recipient, nickname)
        dispatch(addToAddressBook(hexPrefixedAddress, nickname));
      }
    },
    update: ({amount, editingTransactionId, from, gas, gasPrice, selectedToken, to, unapprovedTxs}) => {
      const editingTx = constructUpdatedTx({
        amount,
        editingTransactionId,
        from,
        gas,
        gasPrice,
        selectedToken,
        to,
        unapprovedTxs,
      });
      dispatch(updateTransaction(editingTx));
    },
    sign: ({selectedToken, to, amount, from, gas, gasPrice}) => {
      const txParams = constructTxParams({amount, from, gas, gasPrice, selectedToken, to});
      console.log("sign", txParams, selectedToken);
      selectedToken
        ? dispatch(signTokenTx(selectedToken.address, to, amount, txParams))
        : dispatch(signTx(txParams));
    },
    updateSend: newSend => dispatch(updateSend(newSend)),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withValidation,
)(Send);
