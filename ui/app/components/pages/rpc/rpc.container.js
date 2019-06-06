import {compose} from "recompose";
import {connect} from "react-redux";
import {setRpcTarget} from "../../../actions";
import Rpc from "./rpc.component";
import withForm from "../../form/withForm";
import withValidation from "../../form/withValidation";


function mapStateToProps () {
  return {};
}

function mapDispatchToProps (dispatch) {
  return {
    setRpcTarget: newRpc => dispatch(setRpcTarget(newRpc)),
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withForm,
  withValidation,
)(Rpc);
