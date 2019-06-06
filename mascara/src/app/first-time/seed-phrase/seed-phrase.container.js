import {connect} from "react-redux";
import {createNewVaultAndRestore, unMarkPasswordForgotten} from "../../../../../ui/app/actions";
import ImportSeedPhrase from "./seed-phrase.component";
import {compose} from "recompose";
import withLoader from "../../../../../ui/app/components/form/withLoader";
import withForm from "../../../../../ui/app/components/form/withForm";
import withValidation from "../../../../../ui/app/components/form/withValidation";
import withNewPassword from "../../../../../ui/app/components/form/withNewPassword";
import withNewConfirm from "../../../../../ui/app/components/form/withNewConfirm";
import withSeed from "../../../../../ui/app/components/form/withSeed";


function mapStateToProps () {
  return {};
}

function mapDispatchToProps (dispatch) {
  return {
    unMarkPasswordForgotten: () => dispatch(unMarkPasswordForgotten()),
    createNewVaultAndRestore: (pw, seed) => dispatch(createNewVaultAndRestore(pw, seed)),
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withLoader("account"),
  withForm,
  withValidation,
  withNewPassword,
  withNewConfirm,
  withSeed,
)(ImportSeedPhrase);

