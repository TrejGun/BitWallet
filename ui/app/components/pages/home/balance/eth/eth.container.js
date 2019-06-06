import {connect} from "react-redux";
import EthBalance from "./eth.component";
import {getConversionRate, getCurrentCurrency, getSelectedAccount} from "../../../../../selectors";


function mapStateToProps ({metamask}) {
  return {
    account: getSelectedAccount(metamask),
    conversionRate: getConversionRate(metamask),
    currentCurrency: getCurrentCurrency(metamask),
  };
}

export default connect(mapStateToProps)(EthBalance);
