import React, {Component, Fragment} from "react";
import {Col, ListGroupItem, Row, Image} from "react-bootstrap";
import {checksumAddress, formatDate} from "../../../../../../util";
import prefixForNetwork from "../../../../../../../lib/etherscan-prefix-for-network";
import abiDecoder from "abi-decoder";
import PropTypes from "prop-types";
import {calcTokenAmount} from "../../../../../../token-util";
import {conversionUtil, multiplyCurrencies} from "../../../../../../conversion-util";
import abi from "human-standard-token-abi";
import {getTokenByAddr} from "../../../balance/token";
import Identicon from "../../../../../identicon";


abiDecoder.addABI(abi);

export default class TransactionListItem extends Component {

  static propTypes = {
    transaction: PropTypes.object,
    currentCurrency: PropTypes.string,
    conversionRate: PropTypes.number,
  };

  state = {
    symbol: "ETH",
    total: 0,
    fiatTotal: "",
    isTokenTx: false,
  };

  async componentDidMount () {
    const {transaction: {txParams: {data} = {}}} = this.props;
    const decodedData = data && abiDecoder.decodeMethod(data) || {};


    const {name: txDataName} = decodedData;
    const isTokenTx = txDataName === "transfer" || txDataName === "approveAndCall";

    this.setState({isTokenTx}, isTokenTx
      ? await this.getSendTokenTotal
      : this.getSendEtherTotal);
  }

  onClick (txHash, network) {
    const url = `https://${prefixForNetwork(network)}etherscan.io/tx/${txHash}`;
    if (global.platform) {
      global.platform.openWindow({url});
    } else {
      global.open(url);
    }
  }

  async getSendTokenTotal () {
    const {
      transaction: {txParams: {data} = {}},
      conversionRate,
      contractExchangeRates,
      currentCurrency,
    } = this.props;

    const decodedData = data && abiDecoder.decodeMethod(data) || {};
    const {params = []} = decodedData;
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

    this.setState({
      symbol,
      total,
      fiatTotal: showFiat && totalInFiat,
      fiatSymbol: showFiat && currentCurrency.toUpperCase(),
    });
  }

  async getTokenInfo () {
    const {transaction: {txParams: {to: toAddress} = {}}, tokenInfoGetter, tokens} = this.props;

    let decimals;
    let symbol;

    ({decimals, symbol} = tokens.filter(({address}) => address === toAddress)[0] || {});

    if (!decimals && !symbol) {
      ({decimals, symbol} = getTokenByAddr(toAddress) || {});
    }

    if (!decimals && !symbol) {
      ({decimals, symbol} = await tokenInfoGetter(toAddress));
    }

    return {decimals, symbol, address: toAddress};
  }

  getSendEtherTotal () {
    const {
      transaction: {txParams: {to: toAddress, value} = {}},
      conversionRate,
      currentCurrency,
    } = this.props;

    if (!toAddress) {
      return {
        symbol: "ETH",
        total: 0,
      };
    }

    const totalInFiat = conversionUtil(value, {
      fromNumericBase: "hex",
      toNumericBase: "dec",
      fromCurrency: "ETH",
      toCurrency: currentCurrency,
      fromDenomination: "WEI",
      numberOfDecimals: 2,
      conversionRate,
    });
    const totalInETH = conversionUtil(value, {
      fromNumericBase: "hex",
      toNumericBase: "dec",
      fromCurrency: "ETH",
      toCurrency: "ETH",
      fromDenomination: "WEI",
      conversionRate,
      numberOfDecimals: 6,
    });

    this.setState({
      symbol: "ETH",
      total: totalInETH,
      fiatTotal: totalInFiat,
      fiatSymbol: currentCurrency.toUpperCase(),
    });
  }

  getAddressText () {
    const {
      transaction: {
        txParams: {to: toAddress, data} = {},
        msgParams,
      },
    } = this.props;

    const decodedData = data && abiDecoder.decodeMethod(data) || {};
    const {name: txDataName, params = []} = decodedData;
    const {value} = params[0] || {};
    const checksummedAddress = checksumAddress(toAddress);
    const checksummedValue = checksumAddress(value);

    let addressText;
    if (txDataName === "transfer" || toAddress) {
      const addressToRender = txDataName === "transfer" ? checksummedValue : checksummedAddress;
      addressText = `${addressToRender.slice(0, 10)}...${addressToRender.slice(-4)}`;
    } else if (msgParams) {
      addressText = "Signature Request";
    } else {
      addressText = "Contract Deployment";
    }

    return addressText;
  }

  renderToImage () {
    const {transaction: {txParams: {to: toAddress}}} = this.props;
    const {isTokenTx} = this.state;

    if (isTokenTx) {
      const token = getTokenByAddr(toAddress);
      if (token) {
        return (
          <Image src={`/app/images/contract/${token.logo}`} height={16} width={16} />
        );
      } else {
        return (
          <Identicon address={toAddress} diameter={16} />
        );
      }
    } else {
      return (
        <Image className="status" src="/app/images/ETH_w.png" height={16} width={16} />
      );
    }
  }

  renderTo () {
    const {transaction} = this.props;
    const {total, symbol} = this.state;

    if (transaction.status !== "confirmed") {
      return null;
    } else {
      return (
        <Fragment>
          {this.renderToImage()}
          <div className="value">{total} {symbol}</div>
        </Fragment>
      );
    }
  }

  render () {
    const {transaction} = this.props;

    return (
      <ListGroupItem key={transaction.id} onClick={() => this.onClick(transaction.hash, transaction.metamaskNetworkId)}>
        <Row>
          <Col xs={6} className="status">
            <Image src={`/app/images/transactions/${transaction.status}.png`} />
            <div className="date">{formatDate(transaction.time)}</div>
            <div className="type">{this.getAddressText()}</div>
          </Col>
          <Col xs={3} className="from">
            <Image className="status" src={`/app/images/item_box.png`} height={16} width={16} />
            <div className="name">{"N/A"}</div>
          </Col>
          <Col xs={3} className="to">
            {this.renderTo()}
          </Col>
        </Row>
      </ListGroupItem>
    );
  }
}
