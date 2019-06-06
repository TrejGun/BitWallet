import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import Network from "./network.component";
import {setProviderType, setRpcTarget} from "../../../../actions";


function mapStateToProps ({appState, metamask}) {
  return {
    provider: metamask.provider,
    frequentRpcList: metamask.frequentRpcList,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    setProviderType: (type) => dispatch(setProviderType(type)),
    setRpcTarget: (target) => dispatch(setRpcTarget(target)),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Network);
