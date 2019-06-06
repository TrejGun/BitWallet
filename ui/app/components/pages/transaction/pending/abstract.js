import React, {Component} from "react";
import {Button, ButtonToolbar, Image, ListGroupItem, Glyphicon} from "react-bootstrap";
import {FormattedMessage, intlShape} from "react-intl";
import {DEFAULT_ROUTE, SEND_ROUTE} from "../../../../routes";
import PropTypes from "prop-types";
import {calcGasTotal, isBalanceSufficient} from "../../send/send.utils";
import BackButton from "../../../buttons/back";
import contractMap from "eth-contract-metadata";
import Identicon from "../../../identicon";
import {conversionUtil, multiplyCurrencies} from "../../../../conversion-util";
import ethUtil from "ethereumjs-util";
import {MIN_GAS_PRICE_HEX} from "../../send/send.constants";


export default class AbstractSend extends Component {

  static propTypes = {
    history: PropTypes.object,
    sendTransaction: PropTypes.func,
    cancelTransaction: PropTypes.func,
    updateSendErrors: PropTypes.func,
    balance: PropTypes.string,
    conversionRate: PropTypes.number,
    send: PropTypes.object,
    identities: PropTypes.object,
    currentCurrency: PropTypes.string,
    editTransaction: PropTypes.func,
    showCustomizeGasModal: PropTypes.func,
    txData: PropTypes.object,
    token: PropTypes.object,
    intl: intlShape,
    getValidation: PropTypes.func,
    addValidationMessage: PropTypes.func,
    delValidationMessage: PropTypes.func,
    isValid: PropTypes.func,
  };

  isBalanceSufficient (txMeta) {
    const {
      balance,
      conversionRate,
    } = this.props;
    const {
      txParams: {
        gas,
        gasPrice,
      },
    } = txMeta;
    const gasTotal = calcGasTotal(gas, gasPrice);

    return isBalanceSufficient({
      amount: "0",
      gasTotal,
      balance,
      conversionRate,
    });
  }

  updateComponentSendErrors (prevProps) {
    const {
      balance: oldBalance,
      conversionRate: oldConversionRate,
    } = prevProps;
    const {
      getValidation,
      addValidationMessage,
      delValidationMessage,
      balance,
      conversionRate,
      send: {
        errors: {
          simulationFails,
        },
      },
    } = this.props;
    const txMeta = this.gatherTxMeta();


    const shouldUpdateBalanceSendErrors = balance && [
      balance !== oldBalance,
      conversionRate !== oldConversionRate,
    ].some(x => Boolean(x)) && !this.isBalanceSufficient(txMeta);
    const shouldUpdateSimulationSendError = Boolean(txMeta.simulationFails) !== Boolean(simulationFails) && txMeta.simulationFails;

    if (shouldUpdateBalanceSendErrors || shouldUpdateSimulationSendError) {
      delValidationMessage(getValidation("amount"));
    }

    if (shouldUpdateBalanceSendErrors) {
      addValidationMessage({
        name: "amount",
        reason: "insufficientFunds",
      });
    }

    if (shouldUpdateSimulationSendError) {
      addValidationMessage({
        name: "amount",
        reason: "simulationFails",
      });
    }
  }

  onSubmit (e) {
    e.preventDefault();
    const {
      sendTransaction,
      addValidationMessage,
    } = this.props;
    const txMeta = this.gatherTxMeta();

    if (!this.isValid()) {
      return;
    }

    const balanceIsSufficient = this.isBalanceSufficient(txMeta);
    if (!balanceIsSufficient) {
      addValidationMessage({
        name: "amount",
        reason: "insufficientFunds",
      });
      return;
    }

    if (!this.verifyGasParams()) {
      addValidationMessage({
        name: "gasTotal",
        reason: "invalidGasParams",
      });
      return;
    }

    sendTransaction(txMeta);
  }

  onCancel (e) {
    e.preventDefault();
    const {cancelTransaction, history} = this.props;
    const txMeta = this.gatherTxMeta();

    cancelTransaction(txMeta)
      .then(() => history.push(DEFAULT_ROUTE));
  }

  isValid () {
    const {isValid} = this.props;
    return isValid();
  }

  editTransaction () {
    const {
      editTransaction,
      history,
    } = this.props;
    const txMeta = this.gatherTxMeta();
    editTransaction(txMeta);
    history.push(SEND_ROUTE);
  }

  renderHeader () {
    const txMeta = this.gatherTxMeta();
    let title;

    if (txMeta.lastGasPrice) {
      title = "speedUpTitle";
    } else if (!txMeta.txParams.to) {
      title = "confirmContract";
    } else {
      title = "confirmSend";
    }

    return (
      <div className="page-container__header">
        <div className="page__title">
          <BackButton
            show={txMeta.lastGasPrice}
            text="edit"
            onClick={::this.editTransaction}
          />
          <FormattedMessage id={`pages.transaction.${title}`} />
        </div>
      </div>
    );
  }

  renderGasFee () {
    const {
      conversionRate,
      send: {
        gasTotal,
        gasLimit,
        gasPrice,
      },
      showCustomizeGasModal,
    } = this.props;
    const txMeta = this.gatherTxMeta();

    const value = conversionUtil(ethUtil.addHexPrefix(gasTotal), {
      fromNumericBase: "hex",
      toNumericBase: "dec",
      fromDenomination: "WEI",
      numberOfDecimals: 9,
      conversionRate,
    });

    return (
      <ListGroupItem className="gas">
        <div className="label">
          <FormattedMessage id="pages.transaction.gasFee" />
        </div>
        <div className="value">
          <div className="raw">
            {value} ETH
          </div>
          <Glyphicon glyph="tasks" onClick={() => showCustomizeGasModal(txMeta, gasLimit, gasPrice, gasTotal)} />
        </div>
      </ListGroupItem>
    );
  }

  renderButtons () {
    return (
      <ButtonToolbar>
        <Button
          bsStyle="default"
          onClick={::this.onCancel}
        >
          <FormattedMessage id="buttons.cancel" />
        </Button>
        <Button
          bsStyle="primary"
          disabled={!this.isValid()}
          onClick={::this.onSubmit}
        >
          <FormattedMessage id="buttons.confirm" />
        </Button>
      </ButtonToolbar>
    );
  }

  renderErrorMessage (message) {
    const {send: {errors}} = this.props;

    if (errors[message]) {
      return (
        <div className="confirm-screen-error">
          {errors[message]}
        </div>
      );
    }

    return null;
  }

  renderImage (address) {
    if (address) {
      if (address in contractMap) {
        return (
          <Image src={`/app/images/contract/${contractMap[address].logo}`} height={30} width={30} />
        );
      } else {
        return (
          <Identicon address={address} diameter={30} />
        );
      }
    } else {
      return (
        <Image className="status" src="/app/images/ETH_w.png" height={30} width={30} />
      );
    }
  }

  getGasFee () {
    const {conversionRate, currentCurrency} = this.props;
    const txMeta = this.gatherTxMeta();
    const txParams = txMeta.txParams || {};

    const gas = txParams.gas;
    const gasPrice = txParams.gasPrice || MIN_GAS_PRICE_HEX;
    const gasTotal = multiplyCurrencies(gas, gasPrice, {
      multiplicandBase: 16,
      multiplierBase: 16,
    });

    const FIAT = conversionUtil(gasTotal, {
      fromNumericBase: "BN",
      toNumericBase: "dec",
      fromDenomination: "WEI",
      fromCurrency: "ETH",
      toCurrency: currentCurrency,
      numberOfDecimals: 2,
      conversionRate,
    });
    const ETH = conversionUtil(gasTotal, {
      fromNumericBase: "BN",
      toNumericBase: "dec",
      fromDenomination: "WEI",
      fromCurrency: "ETH",
      toCurrency: "ETH",
      numberOfDecimals: 6,
      conversionRate,
    });

    return {
      FIAT,
      ETH,
    };
  }
}
