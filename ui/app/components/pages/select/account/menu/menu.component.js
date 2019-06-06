import React, {Component} from "react";
import PropTypes from "prop-types";
import {DropdownButton, MenuItem} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import copyToClipboard from "copy-to-clipboard";
import {createAccountLink} from "etherscan-link";
import {DETAIL_ACCOUNT_ROUTE} from "../../../../../routes";


export default class AccountMenu extends Component {

  static propTypes = {
    history: PropTypes.object,
    network: PropTypes.string,
    address: PropTypes.string,
  };

  onSelect (eventKey) {
    const {
      address,
      network,
      history,
    } = this.props;

    switch (eventKey) {
      case "export":
        history.push(DETAIL_ACCOUNT_ROUTE.replace(":address", address));
        break;
      case "copy":
        copyToClipboard(address);
        break;
      case "open":
        const url = createAccountLink(address, network);
        if (global.platform) {
          global.platform.openWindow({url});
        } else {
          global.open(url);
        }
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
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem eventKey="export">
          <FormattedMessage id="components.account-menu.export" />
        </MenuItem>
        <MenuItem eventKey="copy">
          <FormattedMessage id="components.account-menu.copyAddress" />
        </MenuItem>
        <MenuItem eventKey="open">
          <FormattedMessage id="components.account-menu.viewOnEtherscan" />
        </MenuItem>
      </DropdownButton>
    );
  }
}
