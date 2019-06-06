import React, {Component} from "react";
import {ListGroupItem, Badge, ListGroup, ButtonToolbar, Button, Grid} from "react-bootstrap";
import Identicon from "../../../identicon/index";
import PropTypes from "prop-types";
import {DEFAULT_ROUTE, IMPORT_ACCOUNT_ROUTE, CREATE_ACCOUNT_ROUTE} from "../../../../routes";
import Menu from "./menu/index";
import {FormattedMessage} from "react-intl";


export default class AccountDropdown extends Component {

  static propTypes = {
    history: PropTypes.object,
    identities: PropTypes.object,
    selectedAddress: PropTypes.string,
    keyrings: PropTypes.array,
    showAccountDetail: PropTypes.func,
    lockMetamask: PropTypes.func,
  };


  // TODO: move me to GEAR button
  logout () {
    const {lockMetamask, history} = this.props;
    lockMetamask();
    history.push(DEFAULT_ROUTE);
  }

  renderAccounts () {
    const {
      selectedAddress,
      keyrings,
      showAccountDetail,
    } = this.props;

    const accountOrder = keyrings.reduce((list, keyring) => list.concat(keyring.accounts), []);
    return accountOrder.map(address => {
      const keyring = keyrings.find(kr => kr.accounts.includes(address));

      return (
        <ListGroupItem
          key={address}
          active={address === selectedAddress}
          onClick={() => showAccountDetail(address)}
        >
          <Identicon address={address} diameter={24} />
          <span className="name">
            {this.getLabel(address)} {this.indicateIfLoose(keyring)}
          </span>
          <Menu address={address} />
        </ListGroupItem>
      );
    });
  }

  indicateIfLoose ({type}) {
    try { // Sometimes keyrings aren't loaded yet:
      if (type !== "HD Key Tree") {
        return <Badge>imported</Badge>;
      } else {
        return null;
      }
    } catch (e) {
    }
  }

  render () {
    const {
      selectedAddress,
      identities,
      history,
    } = this.props;

    if (!identities[selectedAddress]) {
      return null;
    }

    return (
      <Grid className="page blue account">
        <ListGroup>
          {this.renderAccounts()}
        </ListGroup>
        <ButtonToolbar>
          <Button onClick={() => history.push(CREATE_ACCOUNT_ROUTE)}>
            <FormattedMessage id="components.account-dropdown.create" />
          </Button>
          <Button onClick={() => history.push(IMPORT_ACCOUNT_ROUTE)}>
            <FormattedMessage id="components.account-dropdown.import" />
          </Button>
        </ButtonToolbar>
      </Grid>
    );
  }

  getLabel (address) {
    const {identities} = this.props;
    return identities[address].name || identities[address].address || "";
  }
}
