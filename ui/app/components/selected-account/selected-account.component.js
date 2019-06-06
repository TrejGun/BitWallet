import React, {Component} from "react";
import PropTypes from "prop-types";
import Copyable from "../copy/copyable";


const addressStripper = (address = "") => {
  if (address.length < 4) {
    return address;
  }

  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export default class SelectedAccount extends Component {
  state = {
    copied: false,
  };

  static propTypes = {
    selectedAddress: PropTypes.string,
    selectedIdentity: PropTypes.object,
  };

  render () {
    const {selectedAddress, selectedIdentity} = this.props;
    return (
      <div className="selected-account">
        <Copyable value={selectedAddress}>
          <div className="selected-account__clickable">
            <div className="selected-account__name">
              {selectedIdentity.name}
            </div>
            <div className="selected-account__address">
              {addressStripper(selectedAddress)}
            </div>
          </div>
        </Copyable>
      </div>
    );
  }
}
