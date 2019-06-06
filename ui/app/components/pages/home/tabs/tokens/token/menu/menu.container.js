import {connect} from "react-redux";
import {compose} from "recompose";
import TokenMenu from "./menu.component";
import {withRouter} from "react-router-dom";
import {showModal} from "../../../../../../../actions";
import {getCurrentNetwork} from "../../../../../../../selectors";


function mapStateToProps ({metamask}) {
  return {
    network: getCurrentNetwork(metamask),
  };
}

function mapDispatchToProps (dispatch) {
  return {
    showHideTokenConfirmationModal: (token) => {
      dispatch(showModal({name: "HIDE_TOKEN_CONFIRMATION", token}));
    },
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(TokenMenu);
