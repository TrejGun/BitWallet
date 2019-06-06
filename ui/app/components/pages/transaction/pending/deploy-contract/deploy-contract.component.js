import React from "react";
import PropTypes from "prop-types";
import {clone} from "lodash";
import {BN} from "ethereumjs-util";
import {conversionUtil} from "../../../../../conversion-util";
import SenderToRecipient from "../../sender-to-recipient/sender-to-recipient";
import AbstractSend from "../abstract";
import {Form, Glyphicon, Grid, ListGroup, ListGroupItem} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


export default class ConfirmDeployContract extends AbstractSend {

  static propTypes = {
    txData: PropTypes.object,
    sendTransaction: PropTypes.func,
    cancelTransaction: PropTypes.func,
    identities: PropTypes.object,
    conversionRate: PropTypes.number,
    currentCurrency: PropTypes.string,
    selectedAddress: PropTypes.string,
  };

  state = {
    valid: false,
    submitting: false,
  };

  // After a customizable state value has been updated,
  gatherTxMeta () {
    return clone(this.state.txData) || clone(this.props.txData);
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

  getData () {
    const {identities} = this.props;
    const txMeta = this.gatherTxMeta();
    const txParams = txMeta.txParams || {};

    return {
      from: {
        address: txParams.from,
        name: identities[txParams.from].name,
      },
      memo: txParams.memo || "",
    };
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
      FIAT: FIAT,
      ETH: ETH,
    };

  }

  renderHeroAmount () {
    const {currentCurrency} = this.props;
    const {FIAT} = this.getAmount();

    return (
      <ListGroupItem className="amount">
        <div className="label">
          <FormattedMessage id="pages.transaction.amount" />
        </div>
        <div className="value">
          <div className="raw">
            {this.renderImage()} {FIAT} {currentCurrency.toUpperCase()}
          </div>
        </div>
      </ListGroupItem>
    );
  }

  renderTotalPlusGas () {
    const {currentCurrency} = this.props;
    const {FIAT: fiatGas, ETH: ethGas} = this.getGasFee();

    return (
      <ListGroupItem className="total">
        <div className="label">
          <FormattedMessage id="pages.transaction.amountPlusGas" />
        </div>
        <div className="value">
          <div className="raw">
            {this.renderImage()} {ethGas} ETH
          </div>
          <div className="converted">
            {fiatGas} {currentCurrency.toUpperCase()}
          </div>
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
    } = this.getData();
    return (
      <Grid className="page">
        <Form id="pending-tx-form" className="confirm-screen-form" onSubmit={::this.onSubmit}>
          {this.renderHeader()}
          <SenderToRecipient
            senderName={fromName}
            senderAddress={fromAddress}
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
}
