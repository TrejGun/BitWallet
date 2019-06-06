import {compose} from "recompose";
import {connect} from "react-redux";
import {setCurrentCurrency} from "../../../../../actions";
import Settings from "./currency.component";
import {getConversionRate, getCurrentCurrency} from "../../../../../selectors";


function mapStateToProps ({metamask}) {
  return {
    conversionRate: getConversionRate(metamask),
    currentCurrency: getCurrentCurrency(metamask),
  };
}

function mapDispatchToProps (dispatch) {
  return {
    setCurrentCurrency: currency => dispatch(setCurrentCurrency(currency)),
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Settings);
