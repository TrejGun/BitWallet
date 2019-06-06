import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {buyEth, hideModal, hideWarning, showModal} from "../../../actions";
import DepositEther from "./deposit-ether.component";
import {getCurrentNetwork, getSelectedAddress} from "../../../selectors";
import {compose} from "recompose";


function mapStateToProps ({metamask}) {
  return {
    network: getCurrentNetwork(metamask),
    selectedAddress: getSelectedAddress(metamask),
  };
}

function mapDispatchToProps (dispatch) {
  return {
    toCoinbase: (address) => dispatch(buyEth({network: "1", address, amount: 0})),
    hideModal: () => dispatch(hideModal()),
    hideWarning: () => dispatch(hideWarning()),
    openBuyShapeShiftModal: () => dispatch(showModal({name: "DEPOSIT_SHAPE_SHIFT"})),
    toFaucet: network => dispatch(buyEth({network})),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DepositEther);
