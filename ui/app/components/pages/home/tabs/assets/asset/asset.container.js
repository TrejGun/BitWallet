import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import Asset from "./asset.component";


function mapStateToProps ({appState, metamask}) {
  return {};
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Asset);
