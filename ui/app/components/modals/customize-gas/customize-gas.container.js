import {connect} from "react-redux";
import {
  getConversionRate,
  getGasIsLoading,
  getSelectedToken,
  getFromBalance,
  getAmountConversionRate,
  getPrimaryCurrency,
} from "../../../selectors";
import CustomizeGasModal from "./customize-gas.component";
import {hideModal, updateSend} from "../../../actions";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import withValidation from "../../form/withValidation";


function mapStateToProps ({metamask, send, appState}) {
  return {
    send,
    gasIsLoading: getGasIsLoading(appState),
    conversionRate: getConversionRate(metamask),
    balance: getFromBalance(metamask),
    primaryCurrency: getPrimaryCurrency(metamask),
    selectedToken: getSelectedToken(metamask),
    amountConversionRate: getAmountConversionRate(metamask),
  };
}

function mapDispatchToProps (dispatch) {
  return {
    hideModal: () => dispatch(hideModal()),
    updateSend: newSend => dispatch(updateSend(newSend)),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withValidation,
)(CustomizeGasModal);
