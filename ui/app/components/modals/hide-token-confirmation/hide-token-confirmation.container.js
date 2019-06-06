import {connect} from "react-redux";
import {hideModal, removeToken} from "../../../actions";
import HideTokenConfirmation from "./hide-token-confirmation.component";


function mapStateToProps ({metamask, appState}) {
  return {
    token: appState.modal.modalState.props.token,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    hideModal: () => dispatch(hideModal()),
    hideToken: address => {
      return dispatch(removeToken(address))
        .then(() => {
          dispatch(hideModal());
        });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HideTokenConfirmation);

