import {connect} from "react-redux";
import {buyWithShapeShift, pairUpdate, shapeShiftSubview} from "../../../../ui/app/actions";
import ShapeShiftForm from "./shapeshift.component";


function mapStateToProps ({metamask}) {
  const {coinOptions, tokenExchangeRates, selectedAddress} = metamask;

  return {
    coinOptions,
    tokenExchangeRates,
    selectedAddress,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    shapeShiftSubview: () => dispatch(shapeShiftSubview()),
    pairUpdate: coin => dispatch(pairUpdate(coin)),
    buyWithShapeShift: data => dispatch(buyWithShapeShift(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShapeShiftForm);
