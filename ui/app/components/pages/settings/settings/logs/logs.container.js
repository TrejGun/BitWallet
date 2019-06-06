import {compose} from "recompose";
import {connect} from "react-redux";
import {displayWarning} from "../../../../../actions";
import Logs from "./logs.component";
import {injectIntl} from "react-intl";


function mapStateToProps () {
  return {};
}

function mapDispatchToProps (dispatch) {
  return {
    displayWarning: warning => dispatch(displayWarning(warning)),
  };
}

export default compose(
  injectIntl,
  connect(mapStateToProps, mapDispatchToProps),
)(Logs);
