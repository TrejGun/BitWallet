import {connect} from "react-redux";
import {compose} from "recompose";
import AccountMenu from "./menu.component";
import {withRouter} from "react-router-dom";
import {getCurrentNetwork} from "../../../../../selectors";


function mapStateToProps ({metamask}) {
  return {
    network: getCurrentNetwork(metamask),
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AccountMenu);
