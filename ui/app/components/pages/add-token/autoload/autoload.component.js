import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {FormattedMessage, intlShape} from "react-intl";
import {Button, ButtonToolbar} from "react-bootstrap";
import List from "../list.component";
import {ZERO_ADDRESS} from "../../../../../../app/scripts/lib/constants";


export default class Autoload extends List {

  static propTypes = {
    history: PropTypes.object,
    tokens: PropTypes.array,
    selectedAddress: PropTypes.string,
    getTokens: PropTypes.func,
    addTokens: PropTypes.func,
    intl: intlShape,
  };

  state = {
    searchResults: [],
    selectedTokens: {},
  };

  async componentDidMount () {
    const {selectedAddress, getTokens} = this.props;
    const tokens = await getTokens(selectedAddress);
    this.setState({
      searchResults: tokens.portfolio
        .filter(token => token.addr !== ZERO_ADDRESS)
        .map(token => Object.assign(token, {address: token.addr})),
    });
  }

  render () {
    const {selectedTokens} = this.state;

    return (
      <Fragment>
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
