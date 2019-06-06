import {connect} from "react-redux";
import {compose} from "recompose";
import Plat from "./plat.component";
import {getCurrentNetwork, getSelectedAddress} from "../../../../../selectors";


function mapStateToProps ({appState, metamask}) {
  return {
    network: getCurrentNetwork(metamask),
    selectedAddress: getSelectedAddress(metamask),
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Plat);
