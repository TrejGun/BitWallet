import React, {Component} from "react";
import PropTypes from "prop-types";
import contractMap from "eth-contract-metadata";
import {Button, Image, ListGroupItem} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import {SEND_ROUTE} from "../../../../../../routes";
import Identicon from "../../../../../identicon";
import TokenMenu from "./menu";


export default class TokenListItem extends Component {

  static propTypes = {
    history: PropTypes.object,
    tokenData: PropTypes.object,
    setSelectedToken: PropTypes.func,
  };

  onClick () {
    const {history, tokenData, setSelectedToken} = this.props;
    setSelectedToken(tokenData.address);
    history.push(SEND_ROUTE);
  }

  renderImage (address) {
    if (address in contractMap) {
      return (
        <Image src={`/app/images/contract/${contractMap[address].logo}`} height={27} width={27} />
      );
    } else {
      return (
        <Identicon address={address} diameter={27} />
      );
    }
  }

  render () {
    const {tokenData} = this.props;

    return (
      <ListGroupItem>
        {this.renderImage(tokenData.address)}
        <span className="name">{tokenData.string} {tokenData.symbol}</span>
        <TokenMenu tokenData={tokenData}/>
        <Button bsStyle="default" onClick={::this.onClick}>
          <FormattedMessage id="buttons.send" />
        </Button>
      </ListGroupItem>
    );
  }
}
