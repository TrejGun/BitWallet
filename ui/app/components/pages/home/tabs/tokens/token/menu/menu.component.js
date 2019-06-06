import React, {Component} from "react";
import PropTypes from "prop-types";
import {DropdownButton, MenuItem} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import copyToClipboard from "copy-to-clipboard";
import {createAccountLink} from "etherscan-link";


export default class TokenMenu extends Component {

  static propTypes = {
    history: PropTypes.object,
    network: PropTypes.string,
    tokenData: PropTypes.object,
    showHideTokenConfirmationModal: PropTypes.func,
  };

  onSelect (eventKey) {
    const {
      network,
      tokenData,
      showHideTokenConfirmationModal,
    } = this.props;

    switch (eventKey) {
      case "hide":
        showHideTokenConfirmationModal(tokenData);
        break;
      case "copy":
        copyToClipboard(tokenData.address);
        break;
      case "open":
        const url = createAccountLink(tokenData.address, network);
        if (global.platform) {
          global.platform.openWindow({url});
        } else {
          global.open(url);
        }
        break;
    }
  }

  render () {

    return (
      <DropdownButton
        bsStyle="default"
        title="..."
        noCaret
        pullRight
        id="token-menu"
        onSelect={::this.onSelect}
      >
        <MenuItem eventKey="hide">
          <FormattedMessage id="components.token-menu.hideToken" />
        </MenuItem>
        <MenuItem eventKey="copy">
          <FormattedMessage id="components.token-menu.copyContractAddress" />
        </MenuItem>
        <MenuItem eventKey="open">
          <FormattedMessage id="components.token-menu.viewOnEtherscan" />
        </MenuItem>
      </DropdownButton>
    );
  }
}
