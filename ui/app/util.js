import ethUtil from "ethereumjs-util";
import hexToBn from "../../app/scripts/lib/hex-to-bn";
import moment from "moment";
import abi from "human-standard-token-abi";


const MIN_GAS_PRICE_GWEI_BN = new ethUtil.BN(1);
const GWEI_FACTOR = new ethUtil.BN(1e9);
const MIN_GAS_PRICE_BN = MIN_GAS_PRICE_GWEI_BN.mul(GWEI_FACTOR);

// formatData :: ( date: <Unix Timestamp> ) -> String
export function formatDate (date) {
  return moment(date).format("MMM DD HH:mm");
}

var valueTable = {
  wei: "1000000000000000000",
  kwei: "1000000000000000",
  mwei: "1000000000000",
  gwei: "1000000000",
  szabo: "1000000",
  finney: "1000",
  ether: "1",
  kether: "0.001",
  mether: "0.000001",
  gether: "0.000000001",
  tether: "0.000000000001",
};
var bnTable = {};
for (var currency in valueTable) {
  bnTable[currency] = new ethUtil.BN(valueTable[currency], 10);
}

export function valuesFor (obj) {
  if (!obj) {
    return [];
  }
  return Object.keys(obj)
    .map(function (key) {
      return obj[key];
    });
}

export function addressSummary (address, firstSegLength = 10, lastSegLength = 4, includeHex = true) {
  if (!address) {
    return "";
  }
  let checked = checksumAddress(address);
  if (!includeHex) {
    checked = ethUtil.stripHexPrefix(checked);
  }
  return checked ? checked.slice(0, firstSegLength) + "..." + checked.slice(checked.length - lastSegLength) : "...";
}

export function miniAddressSummary (address) {
  if (!address) {
    return "";
  }
  var checked = checksumAddress(address);
  return checked ? checked.slice(0, 4) + "..." + checked.slice(-4) : "...";
}

export function isValidAddress (address) {
  var prefixed = ethUtil.addHexPrefix(address);
  if (address === "0x0000000000000000000000000000000000000000") {
    return false;
  }
  return (isAllOneCase(prefixed) && ethUtil.isValidAddress(prefixed)) || ethUtil.isValidChecksumAddress(prefixed);
}

export function isValidENSAddress (address) {
  return address.match(/^.{7,}\.(eth|test)$/);
}

export function isInvalidChecksumAddress (address) {
  var prefixed = ethUtil.addHexPrefix(address);
  if (address === "0x0000000000000000000000000000000000000000") {
    return false;
  }
  return !isAllOneCase(prefixed) && !ethUtil.isValidChecksumAddress(prefixed) && ethUtil.isValidAddress(prefixed);
}

export function isAllOneCase (address) {
  if (!address) {
    return true;
  }
  var lower = address.toLowerCase();
  var upper = address.toUpperCase();
  return address === lower || address === upper;
}

// Takes wei Hex, returns wei BN, even if input is null
export function numericBalance (balance) {
  if (!balance) {
    return new ethUtil.BN(0, 16);
  }
  var stripped = ethUtil.stripHexPrefix(balance);
  return new ethUtil.BN(stripped, 16);
}

// Takes  hex, returns [beforeDecimal, afterDecimal]
export function parseBalance (balance) {
  var beforeDecimal, afterDecimal;
  const wei = numericBalance(balance);
  var weiString = wei.toString();
  const trailingZeros = /0+$/;

  beforeDecimal = weiString.length > 18 ? weiString.slice(0, weiString.length - 18) : "0";
  afterDecimal = ("000000000000000000" + wei).slice(-18).replace(trailingZeros, "");
  if (afterDecimal === "") {
    afterDecimal = "0";
  }
  return [beforeDecimal, afterDecimal];
}

// Takes wei hex, returns an object with three properties.
// Its "formatted" property is what we generally use to render values.
export function formatBalance (balance, decimalsToKeep, needsParse = true) {
  var parsed = needsParse ? parseBalance(balance) : balance.split(".");
  var beforeDecimal = parsed[0];
  var afterDecimal = parsed[1];
  var formatted = "None";
  if (decimalsToKeep === undefined) {
    if (beforeDecimal === "0") {
      if (afterDecimal !== "0") {
        var sigFigs = afterDecimal.match(/^0*(.{2})/); // default: grabs 2 most significant digits
        if (sigFigs) {
          afterDecimal = sigFigs[0];
        }
        formatted = "0." + afterDecimal + " ETH";
      }
    } else {
      formatted = beforeDecimal + "." + afterDecimal.slice(0, 3) + " ETH";
    }
  } else {
    afterDecimal += Array(decimalsToKeep).join("0");
    formatted = beforeDecimal + "." + afterDecimal.slice(0, decimalsToKeep) + " ETH";
  }
  return formatted;
}


export function generateBalanceObject (formattedBalance, decimalsToKeep = 1) {
  var balance = formattedBalance.split(" ")[0];
  var label = formattedBalance.split(" ")[1];
  var beforeDecimal = balance.split(".")[0];
  var afterDecimal = balance.split(".")[1];
  var shortBalance = shortenBalance(balance, decimalsToKeep);

  if (beforeDecimal === "0" && afterDecimal.substr(0, 5) === "00000") {
    // eslint-disable-next-line eqeqeq
    if (afterDecimal == 0) {
      balance = "0";
    } else {
      balance = "<1.0e-5";
    }
  } else if (beforeDecimal !== "0") {
    balance = `${beforeDecimal}.${afterDecimal.slice(0, decimalsToKeep)}`;
  }

  return {balance, label, shortBalance};
}

export function shortenBalance (balance, decimalsToKeep = 1) {
  var truncatedValue;
  var convertedBalance = parseFloat(balance);
  if (convertedBalance > 1000000) {
    truncatedValue = (balance / 1000000).toFixed(decimalsToKeep);
    return `${truncatedValue}m`;
  } else if (convertedBalance > 1000) {
    truncatedValue = (balance / 1000).toFixed(decimalsToKeep);
    return `${truncatedValue}k`;
  } else if (convertedBalance === 0) {
    return "0";
  } else if (convertedBalance < 0.001) {
    return "<0.001";
  } else if (convertedBalance < 1) {
    var stringBalance = convertedBalance.toString();
    if (stringBalance.split(".")[1].length > 3) {
      return convertedBalance.toFixed(3);
    } else {
      return stringBalance;
    }
  } else {
    return convertedBalance.toFixed(decimalsToKeep);
  }
}

export function dataSize (data) {
  var size = data ? ethUtil.stripHexPrefix(data).length : 0;
  return size + " bytes";
}

// Takes a BN and an ethereum currency name,
// returns a BN in wei
export function normalizeToWei (amount, currency) {
  try {
    return amount.mul(bnTable.wei).div(bnTable[currency]);
  } catch (e) {
  }
  return amount;
}

export function normalizeEthStringToWei (str) {
  const parts = str.split(".");
  let eth = new ethUtil.BN(parts[0], 10).mul(bnTable.wei);
  if (parts[1]) {
    var decimal = parts[1];
    while (decimal.length < 18) {
      decimal += "0";
    }
    if (decimal.length > 18) {
      decimal = decimal.slice(0, 18);
    }
    const decimalBN = new ethUtil.BN(decimal, 10);
    eth = eth.add(decimalBN);
  }
  return eth;
}

var multiple = new ethUtil.BN("10000", 10);

export function normalizeNumberToWei (n, currency) {
  var enlarged = n * 10000;
  var amount = new ethUtil.BN(String(enlarged), 10);
  return normalizeToWei(amount, currency).div(multiple);
}

export function readableDate (ms) {
  var date = new Date(ms);
  var month = date.getMonth();
  var day = date.getDate();
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();

  var dateStr = `${month}/${day}/${year}`;
  var time = `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
  return `${dateStr} ${time}`;
}

export function isHex (str) {
  return Boolean(str.match(/^(0x)?[0-9a-fA-F]+$/));
}

export function bnMultiplyByFraction (targetBN, numerator, denominator) {
  const numBN = new ethUtil.BN(numerator);
  const denomBN = new ethUtil.BN(denominator);
  return targetBN.mul(numBN).div(denomBN);
}

export function getTxFeeBn (gas, gasPrice = MIN_GAS_PRICE_BN.toString(16), blockGasLimit) {
  const gasBn = hexToBn(gas);
  const gasPriceBn = hexToBn(gasPrice);
  const txFeeBn = gasBn.mul(gasPriceBn);

  return txFeeBn.toString(16);
}

export function getContractAtAddress (tokenAddress) {
  // this function can't be debugged in dev env because its impossible to obtain
  // extension.runtime.connect for Eth in browser window, only in extension
  return global.eth.contract(abi).at(tokenAddress);
}

export function exportAsFile (filename, data) {
  // source: https://stackoverflow.com/a/33542499 by Ludovic Feltz
  const blob = new Blob([data], {type: "text/csv"});
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const elem = window.document.createElement("a");
    elem.target = "_blank";
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

export function allNull (obj) {
  return Object.entries(obj).every(([key, value]) => value === null);
}

export function getTokenAddressFromTokenObject (token) {
  return Object.values(token)[0].address.toLowerCase();
}

/**
 * Safely checksumms a potentially-null address
 *
 * @param {String} [address] - address to checksum
 * @returns {String} - checksummed address
 */
export function checksumAddress (address) {
  return address ? ethUtil.toChecksumAddress(address) : "";
}
