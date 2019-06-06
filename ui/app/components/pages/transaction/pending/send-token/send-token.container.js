import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {connect} from "react-redux";
import abiDecoder from "abi-decoder";
import {backToAccountDetail, cancelTx, setSelectedTokenAddress, showModal, updateSend} from "../../../../../actions";
import ethUtil from "ethereumjs-util";
import {conversionUtil, multiplyCurrencies} from "../../../../../conversion-util";
import {
  getConversionRate,
  getCurrentCurrency,
  getFromBalance,
  getSelectedAddress,
  getTokenExchangeRate,
} from "../../../../../selectors";
import ConfirmSendToken from "./send-token.component";
import withValidation from "../../../../form/withValidation";
import {injectIntl} from "react-intl";


function mapStateToProps ({metamask, send}, ownProps) {
  const {token: {address}, txData} = ownProps;
  const {txParams} = txData || {};
  const tokenData = txParams.data && abiDecoder.decodeMethod(txParams.data) || {};

  const {
    identities,
  } = metamask;
  return {
    send,
    identities,
    tokenData,
    conversionRate: getConversionRate(metamask),
    selectedAddress: getSelectedAddress(metamask),
    tokenExchangeRate: getTokenExchangeRate(metamask, address),
    currentCurrency: getCurrentCurrency(metamask),
    balance: getFromBalance(metamask),
  };
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    backToAccountDetail: address => dispatch(backToAccountDetail(address)),
    cancelTransaction: ({id}) => dispatch(cancelTx({id})),
    editTransaction: txMeta => {
      const {token: {address}} = ownProps;
      const {txParams = {}, id} = txMeta;
      const tokenData = txParams.data && abiDecoder.decodeMethod(txParams.data) || {};
      const {params = []} = tokenData;
      const {value: to} = params[0] || {};
      const {value: tokenAmountInDec} = params[1] || {};
      const tokenAmountInHex = conversionUtil(tokenAmountInDec, {
        fromNumericBase: "dec",
        toNumericBase: "hex",
      });
      const {
        gas: gasLimit,
        gasPrice,
      } = txParams;
      dispatch(setSelectedTokenAddress(address));
      dispatch(updateSend({
        gasLimit,
        gasPrice,
        gasTotal: null,
        to,
        amount: tokenAmountInHex,
        errors: {to: null, amount: null},
        editingTransactionId: id && id.toString(),
        token: ownProps.token,
      }));
    },
    showCustomizeGasModal: (txMeta, sendGasLimit, sendGasPrice, sendGasTotal) => {
      const {id, txParams, lastGasPrice} = txMeta;
      const {gas: txGasLimit, gasPrice: txGasPrice} = txParams;
      const tokenData = txParams.data && abiDecoder.decodeMethod(txParams.data);
      const {params = []} = tokenData;
      const {value: to} = params[0] || {};
      const {value: tokenAmountInDec} = params[1] || {};
      const tokenAmountInHex = conversionUtil(tokenAmountInDec, {
        fromNumericBase: "dec",
        toNumericBase: "hex",
      });

      let forceGasMin;
      if (lastGasPrice) {
        forceGasMin = ethUtil.addHexPrefix(multiplyCurrencies(lastGasPrice, 1.1, {
          multiplicandBase: 16,
          multiplierBase: 10,
          toNumericBase: "hex",
          fromDenomination: "WEI",
        }));
      }

      dispatch(updateSend({
        gasLimit: sendGasLimit || txGasLimit,
        gasPrice: sendGasPrice || txGasPrice,
        editingTransactionId: id,
        gasTotal: sendGasTotal,
        to,
        amount: tokenAmountInHex,
        forceGasMin,
      }));
      dispatch(showModal({name: "CUSTOMIZE_GAS"}));
    },
  };
}

export default compose(
  injectIntl,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withValidation,
)(ConfirmSendToken);
