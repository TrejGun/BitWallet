import React, {Component} from "react";
import {Button, Grid, ListGroup, ListGroupItem} from "react-bootstrap";
import PropTypes from "prop-types";
import {RPC_ROUTE} from "../../../../routes";
import {KOVAN, LOCALHOST, MAINNET, RINKEBY, ROPSTEN} from "../../../../../../app/scripts/controllers/network/enums";
import {FormattedMessage} from "react-intl";


const defaultNetworks = [MAINNET, ROPSTEN, KOVAN, RINKEBY, LOCALHOST];

export default class Network extends Component {

  static propTypes = {
    history: PropTypes.object,
    provider: PropTypes.object,
    frequentRpcList: PropTypes.array,
    setProviderType: PropTypes.func,
    setRpcTarget: PropTypes.func,
  };

  static defaultProps = {
    frequentRpcList: [],
  };

  renderDefaultNetworks () {
    const {provider, setProviderType} = this.props;
    return defaultNetworks.map(network => {
      return (
        <ListGroupItem
          key={network}
          active={provider.type === network}
          onClick={() => setProviderType(network)}>
          <span className="name">
            {Network.formatProviderType(network)}
          </span>
        </ListGroupItem>
      );
    });
  }

  renderCommonNetworks () {
    const {provider, frequentRpcList, setRpcTarget} = this.props;

    return frequentRpcList.reverse().map(rpcTarget => {
      if (rpcTarget === "http://localhost:8545") {
        return null;
      } else {
        return (
          <ListGroupItem
            key={rpcTarget}
            active={provider.type === "rpc" && provider.rpcTarget === rpcTarget}
            onClick={() => setRpcTarget(rpcTarget)}>
            <span className="name">
              {rpcTarget}
            </span>
          </ListGroupItem>
        );
      }
    });
  }

  render () {
    const {history} = this.props;

    return (
      <Grid className="page blue network">
        <ListGroup>
          {this.renderDefaultNetworks()}
          {this.renderCommonNetworks()}
        </ListGroup>
        <Button onClick={() => history.push(RPC_ROUTE)}>
          <FormattedMessage id="components.network-dropdown.custom" />
        </Button>
      </Grid>
    );
  }

  static formatProviderType (type) {
    if (type === "rpc") {
      return "Custom RPC";
    } else {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
}
