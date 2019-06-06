import {connect} from "react-redux";
import {exportAccount, hideModal, showModal} from "../../../actions";
import {getSelectedIdentity} from "../../../selectors";
import ExportPrivateKey from "./export-private-key.component";
import {addValidationMessage} from "../../input/actions";
import {compose} from "recompose";
import withForm from "../../form/withForm";
import withValidation from "../../form/withValidation";
import withPassword from "../../form/withPassword";


function mapStateToProps ({appState, metamask}) {
  return {
    warning: appState.warning,
    privateKey: appState.accountDetail.privateKey, // TODO ??
    selectedIdentity: getSelectedIdentity(metamask),
    previousModalState: appState.modal.previousModalState.name,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    exportAccount: (password, address) => dispatch(exportAccount(password, address)),
    showAccountDetailModal: () => dispatch(showModal({name: "ACCOUNT_DETAILS"})),
    hideModal: () => dispatch(hideModal()),
    addValidationMessage: (message) => dispatch(addValidationMessage(message)),
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withForm,
  withValidation,
  withPassword,
)(ExportPrivateKey);

