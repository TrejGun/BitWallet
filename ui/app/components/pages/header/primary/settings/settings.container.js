import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import Settings from "./settings.component";


function mapStateToProps () {
  return {};
}

function mapDispatchToProps () {
  return {};
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Settings);
