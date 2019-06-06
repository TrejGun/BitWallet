import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import ethUtil from "ethereumjs-util";
import {MIN_GAS_LIMIT_HEX, MIN_GAS_PRICE_GWEI, MIN_GAS_PRICE_HEX} from "../../pages/send/send.constants";
import {isBalanceSufficient} from "../../pages/send/send.utils";
import {
  conversionGreaterThan,
  conversionMax,
  conversionUtil,
  multiplyCurrencies,
  subtractCurrencies,
} from "../../../conversion-util";
import {FormattedMessage} from "react-intl";
import Input from "../../input/input.group.validation";
import {Button, ButtonToolbar, Modal} from "react-bootstrap";


export default class CustomizeGasModal extends Component {

  static propTypes = {
    hideModal: PropTypes.func,
    updateSend: PropTypes.func,

    getValidation: PropTypes.func,
    delValidationMessage: PropTypes.func,
    addValidationMessage: PropTypes.func,

    send: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
      amount: PropTypes.string,
      gasLimit: PropTypes.string,
      gasPrice: PropTypes.string,
      gasTotal: PropTypes.string,
      forceGasMin: PropTypes.string,
      memo: PropTypes.string,
      maxModeOn: PropTypes.bool,
      editingTransactionId: PropTypes.number,
    }),

    selectedToken: PropTypes.object,
    balance: PropTypes.string,
    conversionRate: PropTypes.number,
    amountConversionRate: PropTypes.number,
    gasIsLoading: PropTypes.bool,
  };

  state = {
    priceSigZeros: "",
    priceSigDec: "",
  };

  updateSend (obj) {
    const {
      send,
      updateSend,
    } = this.props;
    updateSend(Object.assign({}, send, obj));
  }

  isValid () {
    const {
      send: {
        gasPrice,
        gasLimit,
      },
    } = this.props;

    if (!gasPrice || !gasLimit) {
      return false;
    }

    return true;
  }

  onCancel (e) {
    e.preventDefault();
    const {hideModal} = this.props;
    hideModal();
  }

  onSubmit () {
    const {
      send: {
        gasPrice,
        gasLimit,
        gasTotal,
        maxModeOn,
        forceGasMin,
      },
      hideModal,
      selectedToken,
      balance,
    } = this.props;

    if (maxModeOn && !selectedToken) {
      this.updateSend({
        amount: subtractCurrencies(
          ethUtil.addHexPrefix(balance),
          ethUtil.addHexPrefix(gasTotal),
          {toNumericBase: "hex"},
        ),
      });
    }

    let newGasPrice = gasPrice;
    if (forceGasMin) {
      newGasPrice = conversionMax({
        value: gasPrice,
        fromNumericBase: "hex",
      }, {
        value: forceGasMin,
        fromNumericBase: "hex",
      });
    }

    this.updateSend({
      gasPrice: ethUtil.addHexPrefix(newGasPrice),
      gasLimit: ethUtil.addHexPrefix(gasLimit),
      gasTotal: ethUtil.addHexPrefix(gasTotal),
    });

    hideModal();
  }

  validateGasLimit () {
    const {
      send: {
        gasLimit,
      },
      conversionRate,
      getValidation,
      addValidationMessage,
      delValidationMessage,
    } = this.props;

    delValidationMessage(getValidation("gasLimit", "low"));

    const gasLimitTooLow = conversionGreaterThan({
      value: MIN_GAS_LIMIT_HEX,
      fromNumericBase: "hex",
      conversionRate,
    }, {
      value: gasLimit,
      fromNumericBase: "hex",
    });

    if (gasLimitTooLow) {
      addValidationMessage({
        name: "gasLimit",
        reason: "low",
      });
    }
  }

  validateGasTotal () {
    const {
      send: {
        gasTotal,
        amount,
        maxModeOn,
      },
      balance,
      selectedToken,
      amountConversionRate,
      conversionRate,
      getValidation,
      addValidationMessage,
      delValidationMessage,
    } = this.props;

    const balanceIsSufficient = isBalanceSufficient({
      amount: selectedToken || maxModeOn ? "0" : amount,
      gasTotal,
      balance,
      selectedToken,
      amountConversionRate,
      conversionRate,
    });

    delValidationMessage(getValidation("gasTotal", "insufficientGas"));

    if (!balanceIsSufficient) {
      addValidationMessage({
        name: "gasTotal",
        reason: "insufficientGas",
      });
    }
  }

  onGasLimitChange (e) {
    const newGasLimit = e.target.value;
    const {
      send: {
        gasPrice,
      },
    } = this.props;

    const gasLimit = conversionUtil(newGasLimit, {
      fromNumericBase: "dec",
      toNumericBase: "hex",
    });

    const gasTotal = multiplyCurrencies(gasLimit, gasPrice, {
      toNumericBase: "hex",
      multiplicandBase: 16,
      multiplierBase: 16,
    });

    this.validateGasTotal(gasTotal);
    this.validateGasLimit(gasLimit);

    this.updateSend({
      gasTotal: ethUtil.addHexPrefix(gasTotal),
      gasLimit: ethUtil.addHexPrefix(gasLimit),
    });
  }

  onGasPriceChange (e) {
    const newGasPrice = e.target.value;
    const {
      send: {
        gasLimit,
      },
    } = this.props;

    const sigZeros = String(newGasPrice).match(/^\d+[.]\d*?(0+)$/);
    const sigDec = String(newGasPrice).match(/^\d+([.])0*$/);

    this.setState({
      priceSigZeros: sigZeros && sigZeros[1] || "",
      priceSigDec: sigDec && sigDec[1] || "",
    });

    const gasPrice = conversionUtil(newGasPrice, {
      fromNumericBase: "dec",
      toNumericBase: "hex",
      fromDenomination: "GWEI",
      toDenomination: "WEI",
    });

    const gasTotal = multiplyCurrencies(gasLimit, gasPrice, {
      toNumericBase: "hex",
      multiplicandBase: 16,
      multiplierBase: 16,
    });

    this.validateGasTotal(gasTotal);

    this.updateSend({gasTotal, gasPrice});
  }

  static onKeyDown (e) {
    if (e.keyCode === 189 || e.keyCode === 69) { // disallow - e
      e.preventDefault();
    }
  }

  getGasLimitValueToRender () {
    const {
      send: {
        gasLimit = MIN_GAS_LIMIT_HEX,
      },
    } = this.props;

    return conversionUtil(gasLimit, {
      fromNumericBase: "hex",
      toNumericBase: "dec",
    });
  }

  getGasPriceValueToRender () {
    const {
      send: {
        gasPrice = MIN_GAS_PRICE_HEX,
        forceGasMin,
      },
    } = this.props;
    const {
      priceSigZeros,
      priceSigDec,
    } = this.state;

    let convertedGasPrice = conversionUtil(gasPrice, {
      fromNumericBase: "hex",
      toNumericBase: "dec",
      fromDenomination: "WEI",
      toDenomination: "GWEI",
    });

    convertedGasPrice += convertedGasPrice.match(/[.]/) ? priceSigZeros : `${priceSigDec}${priceSigZeros}`;

    if (forceGasMin) {
      const convertedMinPrice = conversionUtil(forceGasMin, {
        fromNumericBase: "hex",
        toNumericBase: "dec",
      });
      convertedGasPrice = conversionMax({
        value: convertedMinPrice,
        fromNumericBase: "dec",
      }, {
        value: convertedGasPrice,
        fromNumericBase: "dec",
      });
    }

    return convertedGasPrice;
  }

  render () {
    const {
      send: {
        gasPrice = MIN_GAS_PRICE_HEX,
        gasLimit = MIN_GAS_LIMIT_HEX,
        forceGasMin,
      },
      gasIsLoading,
    } = this.props;

    if (gasIsLoading) {
      return null;
    }

    console.log("CustomizeGasModal:render", this.props);

    return (
      <Fragment>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-lg">
            <FormattedMessage id="modals.gas.title" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input
            name="gasPrice"
            type="number"
            min={forceGasMin || parseInt(MIN_GAS_PRICE_GWEI)}
            step={1}
            value={this.getGasPriceValueToRender(gasPrice)}
            onKeyDown={CustomizeGasModal.onKeyDown}
            onChange={::this.onGasPriceChange}
            placeholder={0}
          />
          <Input
            name="gasLimit"
            type="number"
            min={1}
            step={1}
            value={this.getGasLimitValueToRender(gasLimit)}
            onKeyDown={CustomizeGasModal.onKeyDown}
            onChange={::this.onGasLimitChange}
            placeholder={0}
          />
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button
              bsStyle="default"
              onClick={::this.onCancel}
            >
              <FormattedMessage id="buttons.cancel" />
            </Button>
            <Button
              bsStyle="primary"
              onClick={::this.onSubmit}
            >
              <FormattedMessage id="buttons.save" />
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Fragment>
    );
  }
}
