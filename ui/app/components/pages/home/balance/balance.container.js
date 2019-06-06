import {connect} from "react-redux";
import {compose} from "recompose";
import Balance from "./balance.component";
import {withRouter} from "react-router-dom";
import {setSelectedTokenAddress, showModal} from "../../../../actions";


function mapStateToProps () {
  return {};
}

function mapDispatchToProps (dispatch) {
  return {
    showModal: (payload) => dispatch(showModal(payload)),
    setSelectedToken: address => dispatch(setSelectedTokenAddress(address)),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Balance);
