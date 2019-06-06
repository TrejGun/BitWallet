import {connect} from "react-redux";
import {showModal} from "../../../actions";
import DepositEther from "./deposit-shape-shift.component";


function mapStateToProps ({metamask}) {
  return {
  };
}

function mapDispatchToProps (dispatch) {
  return {
    openBuyEtherModal: () => dispatch(showModal({name: "DEPOSIT_ETHER"})),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositEther);
