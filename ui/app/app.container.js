import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {setCurrentCurrency} from "./actions";
import App from "./app.component";
import {injectIntl} from "react-intl";
import {getCurrentNetwork} from "./selectors";


function mapStateToProps ({appState, metamask}) {
  return {
    isLoading: appState.isLoading,
    loadingMessage: appState.loadingMessage,
    network: getCurrentNetwork(metamask),
    provider: metamask.provider,
    currentCurrency: metamask.currentCurrency,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    setCurrentCurrencyToUSD: () => dispatch(setCurrentCurrency("usd")),
  };
}

export default compose(
  withRouter,
  injectIntl, // TODO FIXME this hack is necessary due to broken intl propagation
  connect(mapStateToProps, mapDispatchToProps),
)(App);
