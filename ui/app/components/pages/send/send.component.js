import React, {Component} from "react";
import PropTypes from "prop-types";
import Dropdown from "../../input/dropdown.group";
import InputDropdown from "../../input/input.dropdown.group";
import InputAddon from "../../input/input.addons.group.validation";
import {Button, ButtonToolbar, Form, Grid, MenuItem} from "react-bootstrap";
import {
  calcMaxAmount,
  doesAmountErrorRequireUpdate,
  getAmountErrorObject,
  getToAddressForGasUpdate,
} from "./send.utils";
import {FormattedMessage} from "react-intl";
import {conversionUtil, multiplyCurrencies} from "../../../conversion-util";
import ethUtil from "ethereumjs-util";
import {isValidAddress} from "../../../util";
import Loading from "../../loading-screen";
import {CONFIRM_TRANSACTION_ROUTE, DEFAULT_ROUTE} from "../../../routes";


export default class Send extends Component {

  static propTypes = {
    history: PropTypes.object,

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

    updateSend: PropTypes.func,
    amountConversionRate: PropTypes.number,
    blockGasLimit: PropTypes.string,
    conversionRate: PropTypes.number,
    fromAccounts: PropTypes.array,
    network: PropTypes.string,
    primaryCurrency: PropTypes.string,
    recentBlocks: PropTypes.array,
    selectedAddress: PropTypes.string,
    selectedToken: PropTypes.object,
    setTokenBalance: PropTypes.func,
    toAccounts: PropTypes.array,
    tokenBalance: PropTypes.string,
    tokenContract: PropTypes.object,
    updateAndSetGasTotal: PropTypes.func,
    updateTokenBalance: PropTypes.func,
    gasIsLoading: PropTypes.bool,

    titleParams: PropTypes.object,
    subtitleParams: PropTypes.object,

    addToAddressBookIfNew: PropTypes.func,
    unapprovedTxs: PropTypes.object,
    update: PropTypes.func,
    sign: PropTypes.func,

    delValidationMessage: PropTypes.func,
    addValidationMessage: PropTypes.func,
    getValidation: PropTypes.func,
    isValid: PropTypes.func,
  };

  updateSend (obj) {
    const {
      send,
      updateSend,
    } = this.props;
    updateSend(Object.assign({}, send, obj));
  }

  componentWillMount () {
    const {
      fromAccounts,
      selectedAddress,
      send: {
        from,
      },
    } = this.props;

    if (!from) {
      this.updateSend({
        from: fromAccounts.find(({address}) => address === selectedAddress).address,
      });
    }
  }

  async componentDidMount () {
    const {
      selectedAddress,
      selectedToken,
      tokenContract,
      updateTokenBalance,
      addValidationMessage,
    } = this.props;

    updateTokenBalance({
      selectedToken,
      tokenContract,
      address: selectedAddress,
    })
      .catch(e => {
        addValidationMessage({
          name: "amount",
          reason: e.message,
        });
      });

    this.updateGas();
  }

  componentDidUpdate (prevProps) {
    const {
      send: {
        from,
        amount,
        gasTotal,
      },
      amountConversionRate,
      conversionRate,
      network,
      fromAccounts,
      primaryCurrency,
      selectedToken,
      tokenBalance,
      updateTokenBalance,
      tokenContract,
      getValidation,
      addValidationMessage,
      delValidationMessage,
    } = this.props;

    const {
      send: {
        from: prevFrom,
        gasTotal: prevGasTotal,
      },
      tokenBalance: prevTokenBalance,
      network: prevNetwork,
    } = prevProps;

    if (!from || !prevFrom) {
      return;
    }

    const {balance: prevBalance} = fromAccounts.find(account => account.address === prevFrom);
    const {balance} = fromAccounts.find(account => account.address === from);

    const uninitialized = [prevBalance, prevGasTotal].every(n => n === null);

    const amountErrorRequiresUpdate = doesAmountErrorRequireUpdate({
      balance,
      gasTotal,
      prevBalance,
      prevGasTotal,
      prevTokenBalance,
      selectedToken,
      tokenBalance,
    });

    if (amountErrorRequiresUpdate) {
      const reason = getAmountErrorObject({
        amount,
        amountConversionRate,
        balance,
        conversionRate,
        gasTotal,
        primaryCurrency,
        selectedToken,
        tokenBalance,
      });

      delValidationMessage(getValidation("amount"));

      if (reason) {
        addValidationMessage({
          name: "amount",
          reason: reason,
        });
      }
    }

    if (!uninitialized) {
      if (network !== prevNetwork && network !== "loading") {
        updateTokenBalance({
          selectedToken,
          tokenContract,
          selectedAddress: from,
        });
        this.updateGas();
      }
    }
  }

  isValid () {
    const {
      selectedToken,
      tokenBalance,
      send: {
        to,
        gasTotal,
      },
      isValid,
    } = this.props;
    const missingTokenBalance = selectedToken && !tokenBalance;

    if (!gasTotal || missingTokenBalance || !to) {
      return false;
    }

    return isValid();
  }

  updateGas ({to: updatedToAddress, amount: value} = {}) {
    const {
      blockGasLimit,
      recentBlocks,
      selectedAddress,
      selectedToken,
      updateAndSetGasTotal,
      addValidationMessage,
      send: {
        to,
        amount,
        gasLimit,
        gasPrice,
        editingTransactionId,
      },
    } = this.props;

    updateAndSetGasTotal({
      blockGasLimit,
      editingTransactionId,
      gasLimit,
      gasPrice,
      recentBlocks,
      selectedAddress,
      selectedToken,
      to: getToAddressForGasUpdate(updatedToAddress, to),
      value: value || amount,
    })
      .then(::this.updateSend)
      .catch(e => {
        addValidationMessage({
          name: "gasTotal",
          reason: e.message,
        });
      });
  }

  async onFromSelect (account) {
    const {
      tokenContract,
      setTokenBalance,
      selectedToken,
    } = this.props;

    if (tokenContract) {
      const usersToken = await tokenContract.balanceOf(account.address);
      setTokenBalance({usersToken, selectedToken});
    }

    this.updateSend({
      from: account.address,
    });
  }

  onToSelect (account) {
    const {
      getValidation,
      addValidationMessage,
      delValidationMessage,
    } = this.props;

    delValidationMessage(getValidation("to"));

    if (!account.address) {
      addValidationMessage({
        name: "to",
        reason: "required",
      });
    } else if (!isValidAddress(account.address)) {
      addValidationMessage({
        name: "to",
        reason: "invalid",
      });
    } else {
      this.updateGas({to: account.address});
    }

    this.updateSend({
      to: account.address,
    });
  }

  onToChange (e) {
    const address = e.target.value;
    this.onToSelect({address});
  }

  onAmountChange (e) {
    const {
      selectedToken,
      addValidationMessage,
    } = this.props;

    const newAmount = e.target.value;

    if (newAmount !== "" && newAmount !== parseFloat(newAmount).toString()) {
      addValidationMessage({
        name: "amount",
        reason: "invalid",
      });
    }

    const {decimals = 0} = selectedToken || {};
    const amount = selectedToken
      ? multiplyCurrencies(newAmount || "0", 10 ** decimals, {toNumericBase: "hex"})
      : conversionUtil(newAmount, {
        fromNumericBase: "dec",
        toNumericBase: "hex",
        toDenomination: "WEI",
      });

    this.updateSend({
      maxModeOn: false,
      amount: ethUtil.addHexPrefix(amount),
    });
  }

  onGasTotalChange (e) {
    const {
      selectedToken,
      addValidationMessage,
    } = this.props;

    const newGasTotal = e.target.value;

    if (newGasTotal !== "" && newGasTotal !== parseFloat(newGasTotal).toString()) {
      addValidationMessage({
        name: "gasTotal",
        reason: "invalid",
      });
    }

    const {decimals = 0} = selectedToken || {};
    const gasTotal = selectedToken
      ? multiplyCurrencies(newGasTotal || "0", 10 ** decimals, {toNumericBase: "hex"})
      : conversionUtil(newGasTotal, {
        fromNumericBase: "dec",
        toNumericBase: "hex",
        toDenomination: "WEI",
      });

    this.updateSend({
      gasTotal: ethUtil.addHexPrefix(gasTotal),
    });
  }

  onMaxClick (e) {
    e.preventDefault();

    const {
      send: {
        from,
        gasTotal,
      },
      fromAccounts,
      selectedToken,
      tokenBalance,
      delValidationMessage,
      getValidation,
    } = this.props;

    const {balance} = fromAccounts.find(account => account.address === from);

    const amount = calcMaxAmount({
      balance,
      gasTotal,
      selectedToken,
      tokenBalance,
    });

    delValidationMessage(getValidation("amount"));

    this.updateSend({
      maxModeOn: true,
      amount: ethUtil.addHexPrefix(amount),
    });
  }

  onGasClick (e) {
    e.preventDefault();
    const {showCustomizeGasModal} = this.props;
    showCustomizeGasModal();
  }

  static onKeyDown (e) {
    if (e.keyCode === 189 || e.keyCode === 69) { // disallow - e
      e.preventDefault();
    }
  }

  static renderItem (account, i) {
    return (
      <MenuItem key={account.address} eventKey={i}>{account.name}</MenuItem>
    );
  }

  getAmountToRender () {
    const {
      conversionRate,
      selectedToken,
      send: {
        amount,
      },
    } = this.props;

    const {decimals = 0, symbol} = selectedToken || {};

    return selectedToken
      ? conversionUtil(amount, {
        fromNumericBase: "hex",
        toNumericBase: "dec",
        toCurrency: symbol,
        conversionRate: 10 ** decimals,
        invertConversionRate: true,
      })
      : conversionUtil(amount, {
        fromNumericBase: "hex",
        toNumericBase: "dec",
        fromDenomination: "WEI",
        numberOfDecimals: 9,
        conversionRate,
      });
  }

  getGasTotalValueToRender () {
    const {
      send: {
        gasTotal,
      },
      conversionRate,
      selectedToken,
    } = this.props;

    if (gasTotal === "0x0") {
      return "0";
    }

    const {decimals = 0, symbol} = selectedToken || {};

    return selectedToken
      ? conversionUtil(gasTotal, {
        fromNumericBase: "hex",
        toNumericBase: "dec",
        toCurrency: symbol,
        conversionRate: 10 ** decimals,
        invertConversionRate: true,
      })
      : conversionUtil(gasTotal, {
        fromNumericBase: "hex",
        toNumericBase: "dec",
        fromDenomination: "WEI",
        numberOfDecimals: 9,
        conversionRate,
      });
  }

  onCancel () {
    const {history} = this.props;
    history.push(DEFAULT_ROUTE);
  }

  onSubmit (e) {
    e.preventDefault();

    const {
      history,
      send: {
        to,
        from,
        amount,
        gasLimit: gas,
        gasPrice,
        editingTransactionId,
      },
      selectedToken,
      sign,
      unapprovedTxs,
      update,
      toAccounts,
      addToAddressBookIfNew,
    } = this.props;

    // TODO: add nickname functionality
    addToAddressBookIfNew(to, toAccounts);

    editingTransactionId
      ? update({amount, editingTransactionId, from, gas, gasPrice, selectedToken, to, unapprovedTxs})
      : sign({selectedToken, to, amount, from, gas, gasPrice});

    history.push(CONFIRM_TRANSACTION_ROUTE);
  }

  renderMaxButton () {
    return (
      <Button onClick={::this.onMaxClick}>
        <FormattedMessage id={"pages.send.max"} />
      </Button>
    );
  }

  renderGasTotalButton () {
    return (
      <Button onClick={::this.onGasClick}>
        <FormattedMessage id={"pages.send.gas"} />
      </Button>
    );
  }

  render () {
    const {
      fromAccounts,
      toAccounts,
      send: {
        from,
        to,
      },
      gasIsLoading,
      titleParams,
      subtitleParams,
    } = this.props;

    if (!from) {
      return null;
    }

    const {name} = fromAccounts.find(account => account.address === from);


    if (gasIsLoading) {
      return (
        <Loading />
      );
    }

    return (
      <Grid className="page">
        <div className="page__title">
          <FormattedMessage {...titleParams} />
        </div>
        <div className="page__subtitle">
          <FormattedMessage {...subtitleParams} />
        </div>

        <Form className="send">
          <Dropdown
            name="from"
            value={name}
            options={fromAccounts}
            onSelect={::this.onFromSelect}
            renderItem={Send.renderItem}
          />
          <InputDropdown
            name="to"
            value={to}
            options={toAccounts}
            onSelect={::this.onToSelect}
            onChange={::this.onToChange}
            renderItem={Send.renderItem}
          />
          <InputAddon
            name="amount"
            type="number"
            min={0}
            value={this.getAmountToRender()}
            onKeyDown={Send.onKeyDown}
            onChange={::this.onAmountChange}
            afterButton={this.renderMaxButton()}
          />
          <InputAddon
            name="gasTotal"
            type="number"
            min={0}
            step={0.0001}
            value={this.getGasTotalValueToRender()}
            onKeyDown={Send.onKeyDown}
            onChange={::this.onGasTotalChange}
            afterButton={this.renderGasTotalButton()}
          />

          <ButtonToolbar>
            <Button
              bsStyle="default"
              onClick={::this.onCancel}
            >
              <FormattedMessage id={`buttons.cancel`} />
            </Button>
            <Button
              bsStyle="primary"
              disabled={!this.isValid()}
              onClick={::this.onSubmit}
            >
              <FormattedMessage id={`buttons.next`} />
            </Button>
          </ButtonToolbar>
        </Form>
      </Grid>
    );
  }
}
