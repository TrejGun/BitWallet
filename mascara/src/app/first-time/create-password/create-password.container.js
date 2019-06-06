import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {createNewVaultAndKeychain} from "../../../../../ui/app/actions";
import CreatePassword from "./create-password.component";
import withLoader from "../../../../../ui/app/components/form/withLoader";
import withForm from "../../../../../ui/app/components/form/withForm";
import withValidation from "../../../../../ui/app/components/form/withValidation";
import withNewPassword from "../../../../../ui/app/components/form/withNewPassword";
import withNewConfirm from "../../../../../ui/app/components/form/withNewConfirm";


function mapStateToProps ({metamask}) {
  const {isInitialized, isUnlocked, isMascara, noActiveNotices} = metamask;

  return {
    isInitialized,
    isUnlocked,
    isMascara,
    noActiveNotices,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    createAccount: (password) => dispatch(createNewVaultAndKeychain(password)),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withLoader("account"),
  withForm,
  withValidation,
  withNewPassword,
  withNewConfirm,
)(CreatePassword);
