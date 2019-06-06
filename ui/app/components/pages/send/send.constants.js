import ethUtil from "ethereumjs-util";
import {conversionUtil, multiplyCurrencies} from "../../../conversion-util";


export const MIN_GAS_PRICE_DEC = "0";
export const MIN_GAS_PRICE_HEX = (parseInt(MIN_GAS_PRICE_DEC)).toString(16);
export const MIN_GAS_LIMIT_DEC = "21000";
export const MIN_GAS_LIMIT_HEX = (parseInt(MIN_GAS_LIMIT_DEC)).toString(16);

export const MIN_GAS_PRICE_GWEI = ethUtil.addHexPrefix(conversionUtil(MIN_GAS_PRICE_HEX, {
  fromDenomination: "WEI",
  toDenomination: "GWEI",
  fromNumericBase: "hex",
  toNumericBase: "hex",
  numberOfDecimals: 1,
}));

export const MIN_GAS_TOTAL = multiplyCurrencies(MIN_GAS_LIMIT_HEX, MIN_GAS_PRICE_HEX, {
  toNumericBase: "hex",
  multiplicandBase: 16,
  multiplierBase: 16,
});

export const TOKEN_TRANSFER_FUNCTION_SIGNATURE = "0xa9059cbb";

export const ONE_GWEI_IN_WEI_HEX = ethUtil.addHexPrefix(conversionUtil("0x1", {
  fromDenomination: "GWEI",
  toDenomination: "WEI",
  fromNumericBase: "hex",
  toNumericBase: "hex",
}));

export const SIMPLE_GAS_COST = "0x5208"; // Hex for 21000, cost of a simple send.
export const BASE_TOKEN_GAS_COST = "0x186a0"; // Hex for 100000, a base estimate for token transfers.
