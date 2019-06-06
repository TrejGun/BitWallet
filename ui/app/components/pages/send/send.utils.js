import {
  addCurrencies,
  conversionGreaterThan,
  conversionGTE,
  conversionLessThan,
  conversionUtil,
  multiplyCurrencies,
  subtractCurrencies,
} from "../../../conversion-util";
import ethUtil from "ethereumjs-util";
import ethAbi from "ethereumjs-abi";
import {calcTokenAmount} from "../../../token-util";
import {
  TOKEN_TRANSFER_FUNCTION_SIGNATURE,
  BASE_TOKEN_GAS_COST,
  ONE_GWEI_IN_WEI_HEX,
  SIMPLE_GAS_COST,
} from "./send.constants";

export function calcMaxAmount ({balance, gasTotal, selectedToken, tokenBalance}) {
  const {decimals = 0} = selectedToken || {};
  const multiplier = Math.pow(10, decimals);

  return selectedToken
    ? multiplyCurrencies(tokenBalance, multiplier, {toNumericBase: "hex"})
    : subtractCurrencies(
      ethUtil.addHexPrefix(balance),
      ethUtil.addHexPrefix(gasTotal),
      {toNumericBase: "hex"},
    );
}

export function addHexPrefixToObjectValues (obj) {
  return Object.keys(obj).reduce((newObj, key) => {
    return {...newObj, [key]: ethUtil.addHexPrefix(obj[key])};
  }, {});
}

export function constructTxParams ({selectedToken, to, amount, from, gas, gasPrice}) {
  const txParams = {
    from: from,
    value: "0",
    gas,
    gasPrice,
  };

  if (!selectedToken) {
    txParams.value = amount;
    txParams.to = to;
  }

  const hexPrefixedTxParams = addHexPrefixToObjectValues(txParams);

  return hexPrefixedTxParams;
}

export function constructUpdatedTx ({amount, editingTransactionId, from, gas, gasPrice, selectedToken, to, unapprovedTxs}) {
  const editingTx = {
    ...unapprovedTxs[editingTransactionId],
    txParams: addHexPrefixToObjectValues({from, gas, gasPrice}),
  };

  if (selectedToken) {
    const data = TOKEN_TRANSFER_FUNCTION_SIGNATURE + Array.prototype.map.call(
      ethAbi.rawEncode(["address", "uint256"], [to, ethUtil.addHexPrefix(amount)]),
      x => ("00" + x.toString(16)).slice(-2),
    ).join("");

    Object.assign(editingTx.txParams, addHexPrefixToObjectValues({
      value: "0",
      to: selectedToken.address,
      data,
    }));
  } else {
    const {data} = unapprovedTxs[editingTransactionId].txParams;

    Object.assign(editingTx.txParams, addHexPrefixToObjectValues({
      value: amount,
      to,
      data,
    }));

    if (typeof editingTx.txParams.data === "undefined") {
      delete editingTx.txParams.data;
    }
  }

  return editingTx;
}

export function addressIsNew (toAccounts, newAddress) {
  return !toAccounts.find(({address}) => newAddress === address);
}

export function calcGasTotal (gasLimit, gasPrice) {
  return multiplyCurrencies(gasLimit, gasPrice, {
    toNumericBase: "hex",
    multiplicandBase: 16,
    multiplierBase: 16,
  });
}

export function isBalanceSufficient ({amount = "0x0", amountConversionRate = 0, balance, conversionRate, gasTotal = "0x0", primaryCurrency}) {
  const totalAmount = addCurrencies(amount, gasTotal, {
    aBase: 16,
    bBase: 16,
    toNumericBase: "hex",
  });

  const balanceIsSufficient = conversionGTE({
    value: balance,
    fromNumericBase: "hex",
    fromCurrency: primaryCurrency,
    conversionRate,
  }, {
    value: totalAmount,
    fromNumericBase: "hex",
    conversionRate: Number(amountConversionRate) || conversionRate,
    fromCurrency: primaryCurrency,
  });

  return balanceIsSufficient;
}

export function isTokenBalanceSufficient ({amount = "0x0", tokenBalance, decimals}) {
  const amountInDec = conversionUtil(amount, {
    fromNumericBase: "hex",
  });

  const tokenBalanceIsSufficient = conversionGTE({
    value: tokenBalance,
    fromNumericBase: "dec",
  }, {
    value: calcTokenAmount(amountInDec, decimals),
    fromNumericBase: "dec",
  });

  return tokenBalanceIsSufficient;
}

export function getAmountErrorObject ({amount, amountConversionRate, balance, conversionRate, gasTotal, primaryCurrency, selectedToken, tokenBalance}) {
  let insufficientFunds = false;
  if (gasTotal && conversionRate) {
    insufficientFunds = !isBalanceSufficient({
      amount: selectedToken ? "0x0" : amount,
      amountConversionRate,
      balance,
      conversionRate,
      gasTotal,
      primaryCurrency,
    });
  }

  let inSufficientTokens = false;
  if (selectedToken && tokenBalance) {
    const {decimals} = selectedToken || {};
    inSufficientTokens = !isTokenBalanceSufficient({
      tokenBalance,
      amount,
      decimals,
    });
  }

  const amountLessThanZero = conversionGreaterThan(
    {value: 0, fromNumericBase: "dec"},
    {value: amount, fromNumericBase: "hex"},
  );

  let amountError = null;

  if (insufficientFunds) {
    amountError = "insufficientFunds";
  } else if (inSufficientTokens) {
    amountError = "insufficientTokens";
  } else if (amountLessThanZero) {
    amountError = "negativeETH";
  }

  return amountError;
}

export function calcTokenBalance ({selectedToken: {decimals} = {}, usersToken}) {
  return calcTokenAmount(usersToken.balance.toString(), decimals) + "";
}

export function doesAmountErrorRequireUpdate ({balance, gasTotal, prevBalance, prevGasTotal, prevTokenBalance, selectedToken, tokenBalance}) {
  const balanceHasChanged = balance !== prevBalance;
  const gasTotalHasChange = gasTotal !== prevGasTotal;
  const tokenBalanceHasChanged = selectedToken && tokenBalance !== prevTokenBalance;
  return balanceHasChanged || gasTotalHasChange || tokenBalanceHasChanged;
}

export async function estimateGas ({selectedAddress, selectedToken, blockGasLimit, to, value, gasPrice, estimateGasMethod}) {
  const paramsForGasEstimate = {from: selectedAddress, value, gasPrice};

  if (selectedToken) {
    paramsForGasEstimate.value = "0x0";
    paramsForGasEstimate.data = generateTokenTransferData({toAddress: to, amount: value, selectedToken});
  }

  // if recipient has no code, gas is 21k max:
  if (!selectedToken) {
    const code = Boolean(to) && await global.eth.getCode(to);
    if (!code || code === "0x") {
      return SIMPLE_GAS_COST;
    }
  } else if (selectedToken && !to) {
    return BASE_TOKEN_GAS_COST;
  }

  paramsForGasEstimate.to = selectedToken ? selectedToken.address : to;

  // if not, fall back to block gasLimit
  paramsForGasEstimate.gas = ethUtil.addHexPrefix(multiplyCurrencies(blockGasLimit, 0.95, {
    multiplicandBase: 16,
    multiplierBase: 10,
    roundDown: "0",
    toNumericBase: "hex",
  }));

  // run tx
  return new Promise((resolve, reject) => {
    return estimateGasMethod(paramsForGasEstimate, (err, estimatedGas) => {
      if (err) {
        const simulationFailed = (
          err.message.includes("Transaction execution error.") ||
          err.message.includes("gas required exceeds allowance or always failing transaction")
        );
        if (simulationFailed) {
          const estimateWithBuffer = addGasBuffer(paramsForGasEstimate.gas, blockGasLimit, 1.5);
          return resolve(ethUtil.addHexPrefix(estimateWithBuffer));
        } else {
          return reject(err);
        }
      }
      const estimateWithBuffer = addGasBuffer(estimatedGas.toString(16), blockGasLimit, 1.5);
      return resolve(ethUtil.addHexPrefix(estimateWithBuffer));
    });
  });
}

export function addGasBuffer (initialGasLimitHex, blockGasLimitHex, bufferMultiplier = 1.5) {
  const upperGasLimit = multiplyCurrencies(blockGasLimitHex, 0.9, {
    toNumericBase: "hex",
    multiplicandBase: 16,
    multiplierBase: 10,
    numberOfDecimals: "0",
  });
  const bufferedGasLimit = multiplyCurrencies(initialGasLimitHex, bufferMultiplier, {
    toNumericBase: "hex",
    multiplicandBase: 16,
    multiplierBase: 10,
    numberOfDecimals: "0",
  });

  // if initialGasLimit is above blockGasLimit, dont modify it
  if (conversionGreaterThan(
    {value: initialGasLimitHex, fromNumericBase: "hex"},
    {value: upperGasLimit, fromNumericBase: "hex"},
  )) {
    return initialGasLimitHex;
  }
  // if bufferedGasLimit is below blockGasLimit, use bufferedGasLimit
  if (conversionLessThan(
    {value: bufferedGasLimit, fromNumericBase: "hex"},
    {value: upperGasLimit, fromNumericBase: "hex"},
  )) {
    return bufferedGasLimit;
  }
  // otherwise use blockGasLimit
  return upperGasLimit;
}

export function generateTokenTransferData ({toAddress = "0x0", amount = "0x0", selectedToken}) {
  if (!selectedToken) {
    return;
  }
  return TOKEN_TRANSFER_FUNCTION_SIGNATURE + Array.prototype.map.call(
    ethAbi.rawEncode(["address", "uint256"], [toAddress, ethUtil.addHexPrefix(amount)]),
    x => ("00" + x.toString(16)).slice(-2),
  ).join("");
}

export function estimateGasPriceFromRecentBlocks (recentBlocks) {
  // Return 1 gwei if no blocks have been observed:
  if (!recentBlocks || recentBlocks.length === 0) {
    return ONE_GWEI_IN_WEI_HEX;
  }

  const lowestPrices = recentBlocks.map((block) => {
    if (!block.gasPrices || block.gasPrices.length < 1) {
      return ONE_GWEI_IN_WEI_HEX;
    }
    return block.gasPrices.reduce((currentLowest, next) => {
      return parseInt(next, 16) < parseInt(currentLowest, 16) ? next : currentLowest;
    });
  })
    .sort((a, b) => parseInt(a, 16) > parseInt(b, 16) ? 1 : -1);

  return lowestPrices[Math.floor(lowestPrices.length / 2)];
}

export function getToAddressForGasUpdate (...addresses) {
  return [...addresses, ""].find(str => str !== undefined && str !== null).toLowerCase();
}

export function removeLeadingZeroes (str) {
  return str.replace(/^0*(?=\d)/, "");
}
