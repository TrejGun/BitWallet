import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import Transactions from "./transactions.component";
import {getConversionRate, transactionsSelector} from "../../../../../selectors";
import {showConfTxPage} from "../../../../../actions";


function mapStateToProps ({metamask}) {
  return {
    txsToRender: transactionsSelector(metamask),
    conversionRate: getConversionRate(metamask),
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
)(Transactions);
