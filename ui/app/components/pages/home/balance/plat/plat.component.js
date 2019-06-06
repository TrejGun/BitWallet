import React, {Component, Fragment} from "react";
import TokenTracker from "eth-token-tracker";
import log from "loglevel";
import PropTypes from "prop-types";
import {Image} from "react-bootstrap";
import abiDecoder from "abi-decoder";
import {calcTokenAmount} from "../../../../../token-util";
import {conversionUtil, multiplyCurrencies} from "../../../../../conversion-util";
import {getTokenBySymbol} from "../token";


export default class Plat extends Component {

  static propTypes = {
    selectedAddress: PropTypes.string,
    network: PropTypes.string,
  };

  state = {
    string: "",
    symbol: "",
    isLoading: true,
    error: null,
  };

  async getSendTokenTotal () {
    const {
      transaction: {txParams},
      conversionRate,
      contractExchangeRates,
      currentCurrency,
    } = this.props;

    const decodedData = txParams.data && abiDecoder.decodeMethod(txParams.data);
    const {params = []} = decodedData || {};
    const {value} = params[1] || {};
    const {decimals, symbol, address} = await this.getTokenInfo();
    const total = calcTokenAmount(value, decimals);

    let tokenToFiatRate;
    let totalInFiat;

    if (contractExchangeRates[address]) {
      tokenToFiatRate = multiplyCurrencies(
        contractExchangeRates[address],
        conversionRate,
      );

      totalInFiat = conversionUtil(total, {
        fromNumericBase: "dec",
        toNumericBase: "dec",
        fromCurrency: symbol,
        toCurrency: currentCurrency,
        numberOfDecimals: 2,
        conversionRate: tokenToFiatRate,
      });
    }

    const showFiat = Boolean(totalInFiat) && currentCurrency.toUpperCase() !== symbol;

    return {
      total: `${total.toFixed(3)} ${symbol}`,
      fiatTotal: showFiat && `${totalInFiat} ${currentCurrency.toUpperCase()}`,
    };
  }

  render () {
    return (
      <div className="value">
        <Image src="/app/images/PLAT_w_ns.png" />
        {this.renderBalance()}
      </div>
    );
  }

  renderBalance () {
    const {symbol, string, isLoading} = this.state;

    if (isLoading) {
      return null;
    }

    return (
      <Fragment>
        <div className="raw">{string} {symbol}</div>
        <div className="converted">XXX</div>
      </Fragment>
    );
  }

  componentDidMount () {
    this.createFreshTokenTracker();
  }

  componentDidUpdate (nextProps) {
    if (nextProps.network !== this.props.network || nextProps.selectedAddress !== this.props.selectedAddress) {
      this.createFreshTokenTracker();
    }
  }

  createFreshTokenTracker () {
    this.cleanUp();

    if (!global.ethereumProvider) {
      return;
    }

    const {selectedAddress} = this.props;

    this.tracker = new TokenTracker({
      userAddress: selectedAddress,
      provider: global.ethereumProvider,
      tokens: [getTokenBySymbol("PLAT")],
      pollingInterval: 8000,
    });

    // Set up listener instances for cleaning up
    this.tracker.on("update", ::this.updateBalance);
    this.tracker.on("error", ::this.showError);

    this.tracker.updateBalances()
      .then(() => {
        this.updateBalance(this.tracker.serialize());
      })
      .catch((reason) => {
        log.error("Problem updating balances", reason);
        this.setState({isLoading: false});
      });
  }

  showError (error) {
    this.setState({error, isLoading: false});
  }

  updateBalance (tokens = []) {
    const [{string, symbol}] = tokens;

    this.setState({
      string,
      symbol,
      isLoading: false,
    });
  }

  componentWillUnmount () {
    this.cleanUp();
  }

  cleanUp () {
    if (!this.tracker) {
      return;
    }
    this.tracker.removeListener("update", ::this.updateBalance);
    this.tracker.removeListener("error", ::this.showError);
    this.tracker.stop();
  }
}
