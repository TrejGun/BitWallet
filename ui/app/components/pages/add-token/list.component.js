import React, {Component} from "react";
import PropTypes from "prop-types";
import {intlShape} from "react-intl";
import {DEFAULT_ROUTE} from "../../../routes";
import {ListGroup, ListGroupItem, Image} from "react-bootstrap";
import TokenListPlaceholder from "./placeholder";
import {checkExistingAddresses} from "./util";
import Identicon from "../../identicon";
import contractMap from "eth-contract-metadata";


export default class List extends Component {

  static propTypes = {
    history: PropTypes.object,
    addTokens: PropTypes.func,
    tokens: PropTypes.array,
    intl: intlShape,
  };

  state = {
    searchResults: [],
    selectedTokens: {},
  };

  onClick (token) {
    const {address} = token;
    const {selectedTokens} = this.state;
    const selectedTokensCopy = {...selectedTokens};

    if (address in selectedTokensCopy) {
      delete selectedTokensCopy[address];
    } else {
      selectedTokensCopy[address] = token;
    }

    this.setState({
      selectedTokens: selectedTokensCopy,
    });
  }

  onNext () {
    const {selectedTokens} = this.state;
    const {history, addTokens} = this.props;

    addTokens(selectedTokens)
      .then(() => {
        history.push(DEFAULT_ROUTE);
      });
  }

  renderImage (address) {
    if (address in contractMap) {
      return (
        <Image src={`/app/images/contract/${contractMap[address].logo}`} height={27} width={27}/>
      );
    } else {
      return (
        <Identicon address={address} diameter={27}/>
      );
    }
  }

  renderToken (token) {
    const {selectedTokens} = this.state;
    const {tokens} = this.props;

    const tokenAlreadyAdded = checkExistingAddresses(token.address, tokens);

    return (
      <ListGroupItem
        disabled={tokenAlreadyAdded}
        key={token.address}
        active={!!selectedTokens[token.address]}
        onClick={() => !tokenAlreadyAdded && this.onClick(token)}>
        {::this.renderImage(token.address)}
        <div className="name">
          {token.symbol}
        </div>
      </ListGroupItem>
    );
  }

  renderList () {
    const {searchResults} = this.state;
    if (!searchResults.length) {
      return (
        <TokenListPlaceholder/>
      );
    }
    return (
      <ListGroup>
        {searchResults.map(::this.renderToken)}
      </ListGroup>
    );
  }
}
