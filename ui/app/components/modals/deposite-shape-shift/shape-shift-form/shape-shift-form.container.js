import {connect} from "react-redux";
import {buyWithShapeShift, pairUpdate, shapeShiftSubview} from "../../../../actions";
import ShapeShiftForm from "./shape-shift-form.component";
import {compose} from "recompose";
import {injectIntl} from "react-intl";


function mapStateToProps ({metamask, appState}) {
  const {
    coinOptions,
    tokenExchangeRates,
    selectedAddress,
  } = metamask;
  const {warning} = appState;

  return {
    coinOptions,
    tokenExchangeRates,
    selectedAddress,
    warning,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    shapeShiftSubview: () => dispatch(shapeShiftSubview()),
    pairUpdate: coin => dispatch(pairUpdate(coin)),
    buyWithShapeShift: data => dispatch(buyWithShapeShift(data)),
  };
}

export default compose(
  injectIntl,
  connect(mapStateToProps, mapDispatchToProps),
)(ShapeShiftForm);
