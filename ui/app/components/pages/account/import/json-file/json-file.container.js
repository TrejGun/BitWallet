import {connect} from "react-redux";
import {importNewAccount} from "../../../../../actions";
import ImportJSONFile from "./json-file.component";
import {compose} from "recompose";
import withLoader from "../../../../form/withLoader";
import withForm from "../../../../form/withForm";
import withValidation from "../../../../form/withValidation";
import withPassword from "../../../../form/withPassword";


function mapStateToProps ({}) {
  return {};
}

function mapDispatchToProps (dispatch) {
  return {
    importNewAccount: (strategy, args) => dispatch(importNewAccount(strategy, args)),
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withLoader("account"),
  withForm,
  withValidation,
  withPassword,
)(ImportJSONFile);
