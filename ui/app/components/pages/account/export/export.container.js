import {connect} from "react-redux";
import {compose} from "recompose";
import ExportAccount from "./export.component";
import withForm from "../../../form/withForm";
import {withRouter} from "react-router-dom";


function mapStateToProps ({metamask, appState}) {
  const {identities, selectedAddress} = metamask;
  const {accountDetail} = appState;


  return {
    identities,
    selectedAddress,
    accountDetail,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    dispatch,
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withForm,
)(ExportAccount);


