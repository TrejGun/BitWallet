import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import currencyFormatter from "currency-formatter";
import {Image} from "react-bootstrap";
import {formatBalance, generateBalanceObject} from "../../../../../util";


export default class EthBalance extends Component {

  static propTypes = {
    token: PropTypes.object,
    shorten: PropTypes.bool,
    account: PropTypes.object,
    showFiat: PropTypes.bool,
    needsParse: PropTypes.bool,
    conversionRate: PropTypes.number,
    currentCurrency: PropTypes.string,
  };

  static defaultProps = {
    showFiat: true,
    needsParse: true,
    shorten: false,
  };

  render () {
    return (
      <div className="value">
        <Image src="/app/images/ETH_w_ns.png" />
        {this.renderBalance()}
      </div>
    );
  }

  renderBalance () {
    const {shorten, account, needsParse} = this.props;
    const balanceValue = account && account.balance;
    const formattedBalance = balanceValue ? formatBalance(balanceValue, 6, needsParse) : "...";

    if (formattedBalance === "None" || formattedBalance === "...") {
      return (
        <Fragment>
          {formattedBalance}
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div className="raw">{this.getTokenBalance(formattedBalance, shorten)}</div>
        <div className="converted">{this.renderFiatValue(formattedBalance)}</div>
      </Fragment>
    );
  }

  renderFiatValue (formattedBalance) {
    const {conversionRate, currentCurrency, showFiat} = this.props;

    if (!showFiat) {
      return null;
    }

    const fiatDisplayNumber = this.getFiatDisplayNumber(formattedBalance, conversionRate);
    const fiatPrefix = currentCurrency === "USD" ? "$" : "";

    return this.renderFiatAmount(fiatDisplayNumber, currentCurrency, fiatPrefix);
  }

  renderFiatAmount (fiatDisplayNumber, fiatSuffix, fiatPrefix) {
    const shouldNotRenderFiat = fiatDisplayNumber === "N/A" || Number(fiatDisplayNumber) === 0;

    if (shouldNotRenderFiat) {
      return null;
    }

    const upperCaseFiatSuffix = fiatSuffix.toUpperCase();

    const display = currencyFormatter.currencies.find(currency => currency.code === upperCaseFiatSuffix)
      ? currencyFormatter.format(Number(fiatDisplayNumber), {
        code: upperCaseFiatSuffix,
      })
      : `${fiatPrefix}${fiatDisplayNumber} ${upperCaseFiatSuffix}`;

    return display;
  }

  getTokenBalance (formattedBalance, shorten) {
    const balanceObj = generateBalanceObject(formattedBalance, shorten ? 1 : 3);

    const balanceValue = shorten ? balanceObj.shortBalance : balanceObj.balance;
    const label = balanceObj.label;

    return `${balanceValue} ${label}`;
  }

  getFiatDisplayNumber (formattedBalance, conversionRate) {
    if (formattedBalance === "None") {
      return formattedBalance;
    }
    if (conversionRate === 0) {
      return "N/A";
    }

    const splitBalance = formattedBalance.split(" ");

    const convertedNumber = (Number(splitBalance[0]) * conversionRate);
    const wholePart = Math.floor(convertedNumber);
    const decimalPart = convertedNumber - wholePart;

    return wholePart + Number(decimalPart.toPrecision(2));
  }
}
