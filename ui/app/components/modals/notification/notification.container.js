import {connect} from "react-redux";
import Notification from "./notification.component";
import {hideModal} from "../../../actions";


function mapDispatchToProps (dispatch) {
  return {
    hideModal: () => dispatch(hideModal()),
  };
}

export default connect(null, mapDispatchToProps)(Notification);
