import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import Assets from "./assets.component";


function mapStateToProps ({appState, metamask}) {
  return {};
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Assets);
