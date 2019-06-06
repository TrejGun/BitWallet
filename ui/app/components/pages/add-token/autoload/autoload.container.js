import {connect} from "react-redux";
import Autoload from "./autoload.component";
import {addTokens} from "../../../../actions";
import {compose} from "recompose";
import {injectIntl} from "react-intl";
import {withRouter} from "react-router-dom";
import {getSelectedAddress} from "../../../../selectors";
import {getTokens} from "../add-token.actions";


function mapStateToProps ({metamask}) {
  const {identities, tokens} = metamask;
  return {
    identities,
    tokens,
    selectedAddress: getSelectedAddress(metamask),
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getTokens: address => dispatch(getTokens(address)),
    addTokens: tokens => dispatch(addTokens(tokens)),
  };
}

export default compose(
  withRouter,
  injectIntl,
  connect(mapStateToProps, mapDispatchToProps),
)(Autoload);
