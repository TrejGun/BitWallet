import {connect} from "react-redux";
import {compose} from "recompose";
import TokenListItem from "./token.component";
import {
  getConversionRate,
  getCurrentCurrency,
  getCurrentNetwork,
  getSelectedAddress,
} from "../../../../../../selectors";
import {setSelectedTokenAddress} from "../../../../../../actions";
import {withRouter} from "react-router-dom";


function mapStateToProps ({appState, metamask}) {
  return {
    network: getCurrentNetwork(metamask),
    conversionRate: getConversionRate(metamask),
    currentCurrency: getCurrentCurrency(metamask),
    selectedTokenAddress: metamask.selectedTokenAddress,
    userAddress: getSelectedAddress(metamask),
    contractExchangeRates: metamask.contractExchangeRates,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    setSelectedToken: address => dispatch(setSelectedTokenAddress(address)),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(TokenListItem);
