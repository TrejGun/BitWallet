import React from "react";
import PropTypes from "prop-types";
import tokenAbi from "human-standard-token-abi";
import abiDecoder from "abi-decoder";
import {clone} from "lodash";
import ethUtil, {BN} from "ethereumjs-util";
import {conversionUtil, multiplyCurrencies} from "../../../../../conversion-util";
import {calcTokenAmount} from "../../../../../token-util";
import currencyFormatter, {currencies} from "currency-formatter";
import {MIN_GAS_PRICE_HEX} from "../../../send/send.constants";
import AbstractSend from "../abstract";
import {Form, Grid, ListGroup, ListGroupItem} from "react-bootstrap";
import SenderToRecipient from "../../sender-to-recipient/sender-to-recipient";
import {FormattedMessage, intlShape} from "react-intl";

abiDecoder.addABI(tokenAbi);


export default class ConfirmSendToken extends AbstractSend {

  static propTypes = {
    editTransaction: PropTypes.func,
    history: PropTypes.object,
    balance: PropTypes.string,
    conversionRate: PropTypes.number,
    send: PropTypes.object,
    selectedAddress: PropTypes.string,
    tokenExchangeRate: PropTypes.number,
    token: PropTypes.object,
    tokenData: PropTypes.object,
    currentCurrency: PropTypes.string,
    identities: PropTypes.object,
    showCustomizeGasModal: PropTypes.func,
    sendTransaction: PropTypes.func,
    isValid: PropTypes.func,
    intl: intlShape,
  };

  state = {};

  componentWillMount () {
    this.updateComponentSendErrors({});
  }

  componentDidUpdate (prevProps) {
    this.updateComponentSendErrors(prevProps);
  }

  getAmount () {
    const {
      conversionRate,
      tokenExchangeRate,
      token,
      tokenData,
      send: {amount, editingTransactionId},
      intl,
    } = this.props;
    const {params = []} = tokenData;
    let {value} = params[1] || {};
    const {decimals} = token;

    if (editingTransactionId) {
      value = conversionUtil(amount, {
        fromNumericBase: "hex",
        toNumericBase: "dec",
      });
    }

    const sendTokenAmount = calcTokenAmount(value, decimals);

    return {
      fiat: tokenExchangeRate
        ? +(sendTokenAmount * tokenExchangeRate * conversionRate).toFixed(2)
        : null,
      token: typeof value === "undefined"
        ? intl.formatMessage({
          id: "pages.transaction.unknown",
        })
        : +sendTokenAmount.toFixed(decimals),
    };

  }

  getData () {
    const {identities, tokenData, intl} = this.props;
    const {params = []} = tokenData;
    const {value} = params[0] || {};
    const txMeta = this.gatherTxMeta();
    const txParams = txMeta.txParams || {};

    return {
      from: {
        address: txParams.from,
        name: identities[txParams.from].name,
      },
      to: {
        address: value,
        name: identities[txParams.to]
          ? identities[txParams.to].name
          : intl.formatMessage({
            id: "pages.transaction.newRecipient",
          }),
      },
      memo: txParams.memo || "",
    };
  }

  renderHeroAmount () {
    const {token: {symbol, address}} = this.props;
    const {token: tokenAmount} = this.getAmount();

    return (
      <ListGroupItem className="amount">
        <div className="label">
          <FormattedMessage id="pages.transaction.amount" />
        </div>
        <div className="value">
          <div className="raw">
            {this.renderImage(address)} {tokenAmount} {symbol}
          </div>
        </div>
      </ListGroupItem>
    );
  }

  renderTotalPlusGas () {
    const {token: {symbol, address}, currentCurrency} = this.props;
    const {token: tokenAmount} = this.getAmount();
    const {fiat: fiatGas, eth: gasETH} = this.getGasFee();

    return (
      <ListGroupItem className="total">
        <div className="label">
          <FormattedMessage id="pages.transaction.amountPlusGas" />
        </div>
        <div className="value">
          <div className="raw">
            {this.renderImage(address)} {tokenAmount} {symbol} + {gasETH} ETH
          </div>
          <div className="converted">
            {tokenAmount} {symbol} + {fiatGas} {currentCurrency}
          </div>
        </div>
      </ListGroupItem>
    );
  }

  convertToRenderableCurrency (value, currencyCode) {
    const upperCaseCurrencyCode = currencyCode.toUpperCase();

    return currencies.find(currency => currency.code === upperCaseCurrencyCode)
      ? currencyFormatter.format(Number(value), {
        code: upperCaseCurrencyCode,
      })
      : value;
  }

  render () {
    const {
      from: {
        address: fromAddress,
        name: fromName,
      },
      to: {
        address: toAddress,
        name: toName,
      },
    } = this.getData();

    return (
      <Grid className="page">
        <Form id="pending-tx-form" className="confirm-screen-form" onSubmit={::this.onSubmit}>
          {this.renderHeader()}
          <SenderToRecipient
            senderName={fromName}
            senderAddress={fromAddress}
            recipientName={toName}
            recipientAddress={toAddress}
          />

          <ListGroup className="confirm">
            {this.renderHeroAmount()}
            {this.renderGasFee()}
            {this.renderTotalPlusGas()}
            {this.renderButtons()}
          </ListGroup>
        </Form>
      </Grid>
    );
  }

// After a customizable state value has been updated,
  gatherTxMeta () {
    const props = this.props;
    const state = this.state;
    const txData = clone(state.txData) || clone(props.txData);

    const {gasPrice: sendGasPrice, gasLimit: sendGasLimit} = props.send;
    const {
      lastGasPrice,
      txParams: {
        gasPrice: txGasPrice,
        gas: txGasLimit,
      },
    } = txData;

    let forceGasMin;
    if (lastGasPrice) {
      forceGasMin = ethUtil.addHexPrefix(multiplyCurrencies(lastGasPrice, 1.1, {
        multiplicandBase: 16,
        multiplierBase: 10,
        toNumericBase: "hex",
      }));
    }

    txData.txParams.gasPrice = sendGasPrice || forceGasMin || txGasPrice;
    txData.txParams.gas = sendGasLimit || txGasLimit;

    // log.debug(`UI has defaulted to tx meta ${JSON.stringify(txData)}`)
    return txData;
  }

  verifyGasParams () {
    // We call this in case the gas has not been modified at all
    if (!this.state) {
      return true;
    }
    return (
      this._notZeroOrEmptyString(this.state.gas) &&
      this._notZeroOrEmptyString(this.state.gasPrice)
    );
  }

  _notZeroOrEmptyString (obj) {
    return obj !== "" && obj !== "0x0";
  }

  bnMultiplyByFraction (targetBN, numerator, denominator) {
    const numBN = new BN(numerator);
    const denomBN = new BN(denominator);
    return targetBN.mul(numBN).div(denomBN);
  }
}
