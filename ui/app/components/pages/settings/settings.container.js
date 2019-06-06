import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import SettingsTabs from "./settings.component";


function mapStateToProps ({appState, metamask}) {
  return {};
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SettingsTabs);
