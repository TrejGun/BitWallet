import React, {Component, Fragment} from "react";
import TokenTracker from "eth-token-tracker";
import log from "loglevel";
import PropTypes from "prop-types";
import TokenListItem from "./token";
import LoadingScreen from "../../../../loading-screen";
import {Col, Grid, ListGroup, Row} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import {ADD_TOKEN_ROUTE} from "../../../../../routes";
import {Link} from "react-router-dom";


export default class Tokens extends Component {
  static propTypes = {
    address: PropTypes.string,
    tokens: PropTypes.array,
    network: PropTypes.string,
    history: PropTypes.object,
  };

  state = {
    tokens: [],
    isLoading: true,
  };

  componentDidMount () {
    this.createFreshTokenTracker();
  }

  createFreshTokenTracker () {
    this.cleanUp();

    if (!global.ethereumProvider) {
      return;
    }

    const {address} = this.props;

    this.tracker = new TokenTracker({
      userAddress: address,
      provider: global.ethereumProvider,
      tokens: this.props.tokens,
      pollingInterval: 8000,
    });

    // Set up listener instances for cleaning up
    this.tracker.on("update", ::this.updateBalances);
    this.tracker.on("error", ::this.showError);

    this.tracker.updateBalances()
      .then(() => {
        this.updateBalances(this.tracker.serialize());
      })
      .catch((reason) => {
        log.error("Problem updating balances", reason);
        this.setState({isLoading: false});
      });
  }

  cleanUp () {
    if (!this.tracker) {
      return;
    }
    this.tracker.removeListener("update", ::this.updateBalances);
    this.tracker.removeListener("error", ::this.showError);
    this.tracker.stop();
  }

  componentDidUpdate (nextProps) {
    const {
      network: oldNet,
      address: oldAddress,
      tokens: oldTokens,
    } = this.props;
    const {
      network: newNet,
      address: newAddress,
      tokens: newTokens,
    } = nextProps;

    const isLoading = newNet === "loading";
    const missingInfo = !oldNet || !newNet || !oldAddress || !newAddress;
    const sameUserAndNetwork = oldAddress === newAddress && oldNet === newNet;
    const shouldUpdateTokens = isLoading || missingInfo || sameUserAndNetwork;

    const oldTokensLength = oldTokens ? oldTokens.length : 0;
    const tokensLengthUnchanged = oldTokensLength === newTokens.length;

    if (tokensLengthUnchanged && shouldUpdateTokens) {
      return;
    }

    this.setState({isLoading: true});
    this.createFreshTokenTracker();
  }

  updateBalances (tokens) {
    this.setState({tokens, isLoading: false});
  }

  showError (error) {
    this.setState({error, isLoading: false});
  }

  componentWillUnmount () {
    this.cleanUp();
  }

  render () {
    const {tokens} = this.props;

    return (
      <Fragment>
        <Grid className="caption">
          <Row>
            <Col xs={6}>
              <FormattedMessage id="pages.home.tabs.tokens.tokenCount" values={{count: tokens.length}} />
            </Col>
            <Col xs={6}>
              <Link to={ADD_TOKEN_ROUTE}>
                <FormattedMessage id="pages.home.tabs.tokens.add" />
              </Link>
            </Col>
          </Row>
        </Grid>
        {this.renderTokensList()}
      </Fragment>
    );
  }

  renderTokensList () {
    const {tokens, isLoading} = this.state;

    if (isLoading) {
      return (
        <LoadingScreen />
      );
    }

    return (
      <ListGroup className="tokens">
        {tokens.map(::this.renderTokenListItem)}
      </ListGroup>
    );
  }

  renderTokenListItem (token) {
    return (
      <TokenListItem key={token.address} tokenData={token} />
    );
  }
}
