import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import {injectIntl} from "react-intl";
import SignatureRequest from "./signature-request.component";


function mapStateToProps () {
  return {};
}

function mapDispatchToProps () {
  return {};
}


export default compose(
  injectIntl,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SignatureRequest);

