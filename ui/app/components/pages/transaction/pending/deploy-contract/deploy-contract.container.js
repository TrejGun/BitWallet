import {connect} from "react-redux";
import {cancelTx, displayWarning, showModal, updateSend} from "../../../../../actions";
import ConfirmDeployContract from "./deploy-contract.component";
import {getConversionRate, getCurrentCurrency, getSelectedAddress} from "../../../../../selectors";
import {compose} from "recompose";
import withValidation from "../../../../form/withValidation";
import ethUtil from "ethereumjs-util";
import {multiplyCurrencies} from "../../../../../conversion-util";


function mapStateToProps ({metamask, send}) {
  const {identities} = metamask;

  return {
    send,
    identities,
    conversionRate: getConversionRate(metamask),
    currentCurrency: getCurrentCurrency(metamask),
    selectedAddress: getSelectedAddress(metamask),
  };
}

function mapDispatchToProps (dispatch) {
  return {
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
  connect(mapStateToProps, mapDispatchToProps),
  withValidation,
)(ConfirmDeployContract);
