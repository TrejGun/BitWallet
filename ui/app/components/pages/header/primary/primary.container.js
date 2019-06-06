import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import Primary from "./primary.component";


function mapStateToProps () {
  return {};
}

function mapDispatchToProps () {
  return {};
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Primary);
