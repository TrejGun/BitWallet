import {connect} from "react-redux";
import {buyEth, showAccountDetail} from "../../../../../ui/app/actions";
import BuyEther from "./buy-ether.component";


function mapStateToProps ({metamask}) {
  const {selectedAddress} = metamask;

  return {
    address: selectedAddress,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    goToCoinbase: address => dispatch(buyEth({network: "1", address, amount: 0})),
    showAccountDetail: address => dispatch(showAccountDetail(address)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BuyEther);
