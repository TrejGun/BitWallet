import {connect} from "react-redux";
import ConfirmResetAccount from "./confirm-reset-account.component";
import {hideModal, resetAccount} from "../../../actions";


function mapDispatchToProps (dispatch) {
  return {
    hideModal: () => dispatch(hideModal()),
    resetAccount: () => dispatch(resetAccount()),
  };
}

export default connect(null, mapDispatchToProps)(ConfirmResetAccount);
