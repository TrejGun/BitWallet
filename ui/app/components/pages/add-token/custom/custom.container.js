import {connect} from "react-redux";
import Search from "./custom.component";
import {addTokens} from "../../../../actions";
import {addValidationMessage, delValidationMessage} from "../../../input/actions";
import {compose} from "recompose";
import {injectIntl} from "react-intl";
import {withRouter} from "react-router-dom";
import withForm from "../../../form/withForm";
import withValidation from "../../../form/withValidation";


function mapStateToProps ({metamask, validations}) {
  const {identities, tokens} = metamask;
  return {
    identities,
    tokens,
    validations,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    addValidationMessage: (message) => dispatch(addValidationMessage(message)),
    delValidationMessage: (message) => dispatch(delValidationMessage(message)),
    addTokens: tokens => dispatch(addTokens(tokens)),
  };
}

export default compose(
  withRouter,
  injectIntl,
  connect(mapStateToProps, mapDispatchToProps),
  withForm,
  withValidation,
)(Search);
