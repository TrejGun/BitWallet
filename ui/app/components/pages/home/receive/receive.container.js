import {connect} from "react-redux";
import {compose} from "recompose";
import Receive from "./receive.component";


function mapStateToProps ({metamask}) {
  const {selectedAddress} = metamask;

  return {
    selectedAddress,
  };
}

function mapDispatchToProps () {
  return {};
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Receive);
