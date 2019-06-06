import {compose} from "recompose";
import {connect} from "react-redux";
import {showModal} from "../../../../../actions";
import Reset from "./reset.component";


function mapStateToProps () {
  return {};
}

function mapDispatchToProps (dispatch) {
  return {
    showResetAccountConfirmationModal: () => dispatch(showModal({name: "CONFIRM_RESET_ACCOUNT"})),
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Reset);
