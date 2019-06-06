import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import RestoreVault from "./restore-vault.component";
import {createNewVaultAndRestore, unMarkPasswordForgotten} from "../../../../actions";
import withLoader from "../../../form/withLoader";
import withForm from "../../../form/withForm";
import withNewPassword from "../../../form/withNewPassword";
import withNewConfirm from "../../../form/withNewConfirm";
import withSeed from "../../../form/withSeed";


function mapStateToProps () {
  return {};
}

function mapDispatchToProps (dispatch) {
  return {
    createNewVaultAndRestore: (password, seed) => dispatch(createNewVaultAndRestore(password, seed)),
    unMarkPasswordForgotten: () => dispatch(unMarkPasswordForgotten()),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withLoader(),
  withForm,
  withNewPassword,
  withNewConfirm,
  withSeed,
)(RestoreVault);
