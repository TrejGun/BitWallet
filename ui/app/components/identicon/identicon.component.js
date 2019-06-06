import React, {Component} from "react";
import PropTypes from "prop-types";
import jdenticon from "jdenticon";


// For additional styling see https://jdenticon.com/icon-designer.html
export default class Identicon extends Component {

  static propTypes = {
    address: PropTypes.string,
    diameter: PropTypes.number,
  };

  static defaultProps = {
    diameter: 42,
  };

  // https://www.chromestatus.com/features/5656049583390720
  render () {
    const {diameter, address} = this.props;
    return (
      <img src={"data:image/svg+xml;utf8," + jdenticon.toSvg(address, diameter).replace(/#/g, "%23")} width={diameter} height={diameter}/>
    );
  }
}
