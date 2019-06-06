import {connect} from "react-redux";
import SelectedAccount from "./selected-account.component";
import {getSelectedAddress, getSelectedIdentity} from "../../selectors";


function mapStateToProps ({metamask}) {
  return {
    selectedAddress: getSelectedAddress(metamask),
    selectedIdentity: getSelectedIdentity(metamask),
  };
}

export default connect(mapStateToProps)(SelectedAccount);
