import React, {Component} from "react";
import PropTypes from "prop-types";
import {checksumAddress} from "../../../util";
import Input from "../../input/input.addons.group";
import {Button} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import copyToClipboard from "copy-to-clipboard";


export default class CopyButton extends Component {

  static propTypes = {
    selectedAddress: PropTypes.string,
  };

  onClick (e) {
    e.preventDefault();
    const {selectedAddress} = this.props;
    copyToClipboard(selectedAddress);
  }

  renderButton () {
    return (
      <Button onClick={::this.onClick}>
        <FormattedMessage id={"components.copyButton.copy"} />
      </Button>
    );
  }

  render () {
    const {selectedAddress} = this.props;

    return (
        <Input
          value={checksumAddress(selectedAddress)}
          afterButton={this.renderButton()}
          readOnly
        />
    );
  }
}
