import contractMap from "eth-contract-metadata";


export function getTokenBySymbol (symbol = "PLAT") {
  const token = Object.entries(contractMap).find(([key, token]) => token.symbol === symbol);

  return token ? {
    ...token[1],
    address: token[0],
  } : null;
}

export function getTokenByAddr (addr) {
  const token = Object.entries(contractMap).find(([key]) => key.toLowerCase() === addr.toLowerCase());

  return token ? {
    ...token[1],
    address: token[0],
  } : null;
}
