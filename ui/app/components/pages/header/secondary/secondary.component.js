import React, {Component} from "react";
import {Nav, Navbar, NavItem} from "react-bootstrap";
import PropTypes from "prop-types";
import {SELECT_ACCOUNT_ROUTE, SELECT_NETWORK_ROUTE} from "../../../../routes";
import {matchPath} from "react-router-dom";


export default class Secondary extends Component {

  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    provider: PropTypes.object,
    identities: PropTypes.object,
    selectedAddress: PropTypes.string,
    isInitialized: PropTypes.bool,
  };

  getLabelForNetwork () {
    const {provider} = this.props;

    if (provider.type === "rpc") {
      return "Custom RPC";
    } else {
      return provider.type.charAt(0).toUpperCase() + provider.type.slice(1);
    }
  }

  getLabelForAccount () {
    const {identities, selectedAddress} = this.props;
    return identities[selectedAddress].name || identities[selectedAddress].address || "";
  }

  onSelect (eventKey) {
    const {history, location} = this.props;

    const isSelectAccount = Boolean(matchPath(location.pathname, {
      path: SELECT_ACCOUNT_ROUTE,
      exact: false,
    }));
    const isSelectNetwork = Boolean(matchPath(location.pathname, {
      path: SELECT_NETWORK_ROUTE,
      exact: false,
    }));

    if (isSelectAccount || isSelectNetwork) {
      history.goBack();
    } else if (eventKey === "account") {
      history.push(SELECT_ACCOUNT_ROUTE);
    } else {
      history.push(SELECT_NETWORK_ROUTE);
    }
  }

  render () {
    const {isInitialized} = this.props;

    if (!isInitialized) {
      return null;
    }

    return (
      <Navbar className="secondary" onSelect={::this.onSelect}>
        <Navbar.Header>
          <Nav>
            <NavItem eventKey="account" href="#">
              {this.getLabelForAccount()}
            </NavItem>
            <NavItem eventKey="network" href="#">
              {this.getLabelForNetwork()}
            </NavItem>
          </Nav>
        </Navbar.Header>
      </Navbar>
    );
  }
}
