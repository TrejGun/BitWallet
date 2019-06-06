import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import Tokens from "./tokens.component";
import {getCurrentNetwork, getSelectedAddress} from "../../../../../selectors";


function mapStateToProps ({appState, metamask}) {
  return {
    network: getCurrentNetwork(metamask),
    tokens: metamask.tokens,
    address: getSelectedAddress(metamask),
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Tokens);
