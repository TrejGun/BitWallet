import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {connect} from "react-redux";
import {
  displayWarning,
  setCurrentCurrency,
  showModal,
  updateCurrentLocale,
} from "../../../../actions";
import Settings from "./settings.component";
import {getConversionRate, getCurrentCurrency} from "../../../../selectors";


function mapStateToProps ({metamask, appState}) {
  return {
    conversionRate: getConversionRate(metamask),
    currentCurrency: getCurrentCurrency(metamask),
    warning: appState.warning,
    currentLocale: metamask.currentLocale,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    setCurrentCurrency: currency => dispatch(setCurrentCurrency(currency)),
    displayWarning: warning => dispatch(displayWarning(warning)),
    updateCurrentLocale: key => dispatch(updateCurrentLocale(key)),
    showResetAccountConfirmationModal: () => dispatch(showModal({name: "CONFIRM_RESET_ACCOUNT"})),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Settings);
