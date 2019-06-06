import {connect} from "react-redux";
import {hideModal, hideWarning} from "../../actions";
import MetaMaskModal from "./modal.component";


function mapStateToProps ({appState}) {
  return {
    active: appState.modal.open,
    modalState: appState.modal.modalState,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    hideModal: () => dispatch(hideModal()),
    hideWarning: () => dispatch(hideWarning()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MetaMaskModal);
