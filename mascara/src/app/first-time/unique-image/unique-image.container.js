import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import UniqueImage from "./unique-image.component";


function mapStateToProps ({metamask}) {
  const {selectedAddress} = metamask;
  return {
    address: selectedAddress,
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps),
)(UniqueImage);
