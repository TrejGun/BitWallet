import {connect} from "react-redux";
import {compose} from "recompose";
import {backToAccountDetail, cancelTx} from "../../../../actions";
import PendingTransaction from "./pending.component";
import {getConversionRate, getSelectedAddress} from "../../../../selectors";


function mapStateToProps ({metamask}) {
  const {
    identities,
    tokens,
  } = metamask;

  return {
    identities,
    conversionRate: getConversionRate(metamask),
    selectedAddress: getSelectedAddress(metamask),
    tokens,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    backToAccountDetail: address => dispatch(backToAccountDetail(address)),
    cancelTransaction: ({id}) => dispatch(cancelTx({id})),
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PendingTransaction);

