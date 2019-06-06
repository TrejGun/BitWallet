import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import Secondary from "./secondary.component";
import {getSelectedAddress} from "../../../../selectors";


function mapStateToProps ({appState, metamask}) {
  return {
    identities: metamask.identities,
    provider: metamask.provider,
    selectedAddress: getSelectedAddress(metamask),
    isInitialized: metamask.isInitialized,
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Secondary);
