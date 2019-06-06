import React from "react";
import PropTypes from "prop-types";
import {clone} from "lodash";
import ethUtil, {BN} from "ethereumjs-util";
import {addCurrencies, conversionUtil, multiplyCurrencies} from "../../../../../conversion-util";
import SenderToRecipient from "../../sender-to-recipient/sender-to-recipient";
import currencyFormatter, {currencies} from "currency-formatter";
import {Form, Grid, ListGroup, ListGroupItem} from "react-bootstrap";
import {FormattedMessage, intlShape} from "react-intl";
import AbstractSend from "../abstract";


export default class ConfirmSendEther extends AbstractSend {
  static propTypes = {
    balance: PropTypes.string,
    conversionRate: PropTypes.number,
    send: PropTypes.object,
    identities: PropTypes.object,
    currentCurrency: PropTypes.string,
    history: PropTypes.object,
    editTransaction: PropTypes.func,
    showCustomizeGasModal: PropTypes.func,
    txData: PropTypes.object,
    addValidationMessage: PropTypes.func,
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
    const {conversionRate, currentCurrency} = this.props;
    const txMeta = this.gatherTxMeta();
    const txParams = txMeta.txParams || {};

    const FIAT = conversionUtil(txParams.value, {
      fromNumericBase: "hex",
      toNumericBase: "dec",
      fromCurrency: "ETH",
      toCurrency: currentCurrency,
      numberOfDecimals: 2,
      fromDenomination: "WEI",
      conversionRate,
    });
    const ETH = conversionUtil(txParams.value, {
      fromNumericBase: "hex",
      toNumericBase: "dec",
      fromCurrency: "ETH",
      toCurrency: "ETH",
      fromDenomination: "WEI",
      conversionRate,
      numberOfDecimals: 6,
    });

    return {
      FIAT,
      ETH,
    };

  }

  getData () {
    const {identities, intl} = this.props;
    const txMeta = this.gatherTxMeta();
    const txParams = txMeta.txParams || {};
    const account = identities ? identities[txParams.from] || {} : {};
    const {FIAT: gasFeeInFIAT, ETH: gasFeeInETH} = this.getGasFee();
    const {FIAT: amountInFIAT, ETH: amountInETH} = this.getAmount();

    const totalInFIAT = addCurrencies(gasFeeInFIAT, amountInFIAT, {
      toNumericBase: "dec",
      numberOfDecimals: 2,
    });
    const totalInETH = addCurrencies(gasFeeInETH, amountInETH, {
      toNumericBase: "dec",
      numberOfDecimals: 6,
    });

    return {
      from: {
        address: txParams.from,
        name: account.name,
      },
      to: {
        address: txParams.to,
        name: identities[txParams.to] ? identities[txParams.to].name : intl.formatMessage({
          id: "pages.transaction.newRecipient",
        }),
      },
      memo: txParams.memo || "",
      gasFeeInFIAT,
      gasFeeInETH,
      amountInFIAT,
      amountInETH,
      totalInFIAT,
      totalInETH,
    };
  }

  convertToRenderableCurrency (value, currencyCode) {
    const upperCaseCurrencyCode = currencyCode.toUpperCase();

    return currencies.find(currency => currency.code === upperCaseCurrencyCode)
      ? currencyFormatter.format(Number(value), {
        code: upperCaseCurrencyCode,
      })
      : value;
  }

  renderTotalPlusGas () {
    const {
      currentCurrency,
    } = this.props;

    const {
      totalInFIAT,
      totalInETH,
    } = this.getData();

    const convertedTotalInFiat = this.convertToRenderableCurrency(totalInFIAT, currentCurrency);

    return (
      <ListGroupItem className="total">
        <div className="label">
          <FormattedMessage id="pages.transaction.amountPlusGas" />
        </div>
        <div className="value">
          <div className="raw">
            {this.renderImage()} {totalInETH} ETH
          </div>
          <div className="converted">
            {convertedTotalInFiat} {currentCurrency.toUpperCase()}
          </div>
        </div>
      </ListGroupItem>
    );
  }

  renderAmount () {
    const {
      currentCurrency,
    } = this.props;
    const {amountInETH, totalInFIAT} = this.getData();
    return (
      <ListGroupItem className="amount">
        <div className="label">
          <FormattedMessage id="pages.transaction.amount" />
        </div>
        <div className="value">
          {this.renderImage()}
          <div className="raw">{amountInETH} ETH</div>
          <div className="converted">{totalInFIAT} {currentCurrency.toUpperCase()}</div>
        </div>
      </ListGroupItem>
    );
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
            {this.renderAmount()}
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
    const {send, txData: propsTxData} = this.props;
    const {txData: stateTxData} = this.state;
    const txData = clone(stateTxData) || clone(propsTxData);

    const {
      gasPrice: sendGasPrice,
      gasLimit: sendGasLimit,
    } = send;
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
