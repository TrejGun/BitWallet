import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {connect} from "react-redux";
import {cancelTx, showModal, updateSend} from "../../../../../actions";
import ethUtil from "ethereumjs-util";
import {multiplyCurrencies} from "../../../../../conversion-util";
import ConfirmSendEther from "./send-ether.component";
import {getConversionRate, getCurrentCurrency, getSelectedAddress, getFromBalance} from "../../../../../selectors";
import withValidation from "../../../../form/withValidation";
import {injectIntl} from "react-intl";


function mapStateToProps ({metamask, send}) {
  return {
    send,
    identities: metamask.identities,
    selectedAddress: getSelectedAddress(metamask),
    conversionRate: getConversionRate(metamask),
    currentCurrency: getCurrentCurrency(metamask),
    balance: getFromBalance(metamask),
  };
}

function mapDispatchToProps (dispatch) {
  return {
    editTransaction: txMeta => {
      const {id, txParams} = txMeta;
      const {
        gas: gasLimit,
        gasPrice,
        to,
        value: amount,
      } = txParams;

      dispatch(updateSend({
        gasLimit,
        gasPrice,
        gasTotal: null,
        to,
        amount,
        errors: {
          to: null,
          amount: null,
        },
        editingTransactionId: id,
      }));
    },
    cancelTransaction: ({id}) => dispatch(cancelTx({id})),
    showCustomizeGasModal: (txMeta, sendGasLimit, sendGasPrice, sendGasTotal) => {
      const {id, txParams, lastGasPrice} = txMeta;
      const {gas: txGasLimit, gasPrice: txGasPrice} = txParams;

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
)(ConfirmSendEther);
