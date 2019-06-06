import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {connect} from "react-redux";
import Seed from "./seed.component";


function mapStateToProps () {
  return {};
}

function mapDispatchToProps () {
  return {};
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Seed);
