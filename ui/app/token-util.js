import log from "loglevel";
import {getContractAtAddress} from "./util";


export function tokenInfoGetter () {
  const tokens = {};

  return async (address) => {
    if (tokens[address]) {
      return tokens[address];
    }

    tokens[address] = await getSymbolAndDecimals(address);

    return tokens[address];
  };
}

export async function getSymbolAndDecimals (tokenAddress, existingTokens = []) {
  const existingToken = existingTokens.find(({address}) => tokenAddress === address);
  if (existingToken) {
    return existingToken;
  }

  let result = [];
  try {
    const token = getContractAtAddress(tokenAddress);

    result = await Promise.all([
      token.symbol(),
      token.decimals(),
    ]);
  } catch (err) {
    log.warn(`symbol() and decimal() calls for token at address ${tokenAddress} resulted in error:`, err);
  }

  const [symbol = [], decimals = []] = result;

  return {
    symbol: symbol[0] || null,
    decimals: decimals[0] && decimals[0].toString() || null,
  };
}

export function calcTokenAmount (value, decimals) {
  const multiplier = Math.pow(10, Number(decimals || 0));
  const amount = Number(value / multiplier);

  return amount;
}
