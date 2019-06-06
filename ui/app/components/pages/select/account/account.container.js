import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import Account from "./account.component";
import {hideWarning, lockMetamask, showAccountDetail} from "../../../../actions";
import {getSelectedAddress} from "../../../../selectors";


function mapStateToProps ({appState, metamask}) {
  return {
    selectedAddress: getSelectedAddress(metamask),
    keyrings: metamask.keyrings,
    identities: metamask.identities,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    showAccountDetail: address => dispatch(showAccountDetail(address)),
    lockMetamask: () => {
      dispatch(hideWarning());
      return dispatch(lockMetamask());
    },
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Account);
