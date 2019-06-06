import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import TransactionListItem from "./transaction.component";
import {showConfTxPage} from "../../../../../../actions";
import {getConversionRate, getCurrentCurrency} from "../../../../../../selectors";


function mapStateToProps ({metamask}) {
  return {
    tokens: metamask.tokens,
    currentCurrency: getCurrentCurrency(metamask),
    conversionRate: getConversionRate(metamask),
    contractExchangeRates: metamask.contractExchangeRates,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    showConfTxPage: ({id}) => dispatch(showConfTxPage({id})),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(TransactionListItem);
