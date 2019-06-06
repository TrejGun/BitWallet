import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import BackButton from "./back.component";


function mapStateToProps () {
  return {};
}

function mapDispatchToProps () {
  return {};
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(BackButton);
