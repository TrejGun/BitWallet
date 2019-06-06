import {connect} from "react-redux";
import {importNewAccount} from "../../../../../actions";
import ImportPrivateKey from "./private-key.component";
import {addValidationMessage, delValidationMessage} from "../../../../input/actions";
import {compose} from "recompose";
import withForm from "../../../../form/withForm";


function mapStateToProps ({appState, validations}) {
  const {isLoading, warning} = appState;

  return {
    isLoading,
    warning,
    validations,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    importNewAccount: (strategy, args) => dispatch(importNewAccount(strategy, args)),
    addValidationMessage: (message) => dispatch(addValidationMessage(message)),
    delValidationMessage: (message) => dispatch(delValidationMessage(message)),
  };
}

export default compose(
  withForm,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ImportPrivateKey);
