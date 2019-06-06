import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {FormattedMessage, intlShape} from "react-intl";
import {Button, ButtonToolbar, Glyphicon} from "react-bootstrap";
import List from "../list.component";
import contractMap from "eth-contract-metadata";
import Fuse from "fuse.js";
import Input from "../../../input/input.addons.group.validation";


const contractList = Object.entries(contractMap)
  .map(([address, tokenData]) => Object.assign({}, tokenData, {address}))
  .filter(tokenData => Boolean(tokenData.erc20));

const fuse = new Fuse(contractList, {
  shouldSort: true,
  threshold: 0.45,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {name: "name", weight: 0.5},
    {name: "symbol", weight: 0.5},
  ],
});


export default class Search extends List {

  static propTypes = {
    history: PropTypes.object,
    addTokens: PropTypes.func,
    tokens: PropTypes.array,
    intl: intlShape,
    formData: PropTypes.shape({
      searchToken: PropTypes.string,
    }),
  };

  state = {
    searchResults: [],
    selectedTokens: {},
  };

  handleSearch (e) {
    const searchQuery = e.target.value;
    const {onChange} = this.props;
    const fuseSearchResult = fuse.search(searchQuery);
    const addressSearchResult = contractList.filter(token => token.address.toLowerCase() === searchQuery.toLowerCase());
    const searchResults = [...addressSearchResult, ...fuseSearchResult];
    this.setState({searchResults});
    onChange(e);
  }

  render () {
    const {selectedTokens} = this.state;
    const {formData: {searchToken}} = this.props;

    return (
      <Fragment>
        <Input
          name="searchToken"
          before={<Glyphicon glyph="search" />}
          defaultValue={searchToken}
          onChange={::this.handleSearch}
        />
        {this.renderList()}
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            onClick={::this.onNext}
            disabled={!Object.keys(selectedTokens).length}
          >
            <FormattedMessage id="buttons.next" />
          </Button>
        </ButtonToolbar>
      </Fragment>
    );
  }
}
