import {valuesFor} from "./util";
import abi from "human-standard-token-abi";

import {
  multiplyCurrencies,
} from "./conversion-util";


export function getSelectedAddress (metamask) {
  return metamask.selectedAddress || Object.keys(metamask.accounts)[0];
}

export function getSelectedIdentity (metamask) {
  const selectedAddress = getSelectedAddress(metamask);
  const identities = metamask.identities;
  return identities[selectedAddress];
}

export function getSelectedAccount (metamask) {
  const accounts = metamask.accounts;
  const selectedAddress = getSelectedAddress(metamask);
  return accounts[selectedAddress];
}

export function getSelectedToken (metamask) {
  const tokens = metamask.tokens || [];
  const selectedTokenAddress = metamask.selectedTokenAddress;
  const selectedToken = tokens.filter(({address}) => address === selectedTokenAddress)[0];
  return selectedToken || null;
}

export function getSelectedTokenExchangeRate (metamask) {
  const contractExchangeRates = metamask.contractExchangeRates;
  const selectedToken = getSelectedToken(metamask);
  const {address} = selectedToken || {};
  return contractExchangeRates[address] || 0;
}

export function getTokenExchangeRate (metamask, address) {
  const contractExchangeRates = metamask.contractExchangeRates;
  return contractExchangeRates[address] || 0;
}

export function getAddressBook (metamask) {
  return metamask.addressBook;
}

export function accountsWithSendEtherInfoSelector (metamask) {
  const {
    accounts,
    identities,
  } = metamask;

  return Object.entries(accounts).map(([key, account]) => {
    return Object.assign({}, account, identities[key]);
  });
}

export function getCurrentAccountWithSendEtherInfo (metamask) {
  const currentAddress = getSelectedAddress(metamask);
  const accounts = accountsWithSendEtherInfoSelector(metamask);

  return accounts.find(({address}) => address === currentAddress);
}

export function transactionsSelector (metamask) {
  const {network, selectedTokenAddress} = metamask;
  const unapprovedMsgs = valuesFor(metamask.unapprovedMsgs);
  const shapeShiftTxList = (network === "1") ? metamask.shapeShiftTxList : undefined;
  const transactions = metamask.selectedAddressTxList || [];
  const txsToRender = !shapeShiftTxList ? transactions.concat(unapprovedMsgs) : transactions.concat(unapprovedMsgs, shapeShiftTxList);

  return selectedTokenAddress
    ? txsToRender
    // .filter(({txParams}) => txParams && txParams.to === selectedTokenAddress)
      .sort((a, b) => b.time - a.time)
    : txsToRender
      .sort((a, b) => b.time - a.time);
}

export function getGasIsLoading (appState) {
  return appState.gasIsLoading;
}

export function getCurrentCurrency (metamask) {
  return metamask.currentCurrency;
}

export function getSelectedTokenToFiatRate (metamask) {
  return parseFloat(multiplyCurrencies(
    getConversionRate(metamask),
    getSelectedTokenExchangeRate(metamask),
    {toNumericBase: "dec"},
  ));
}

export function getSelectedTokenContract (metamask) {
  const selectedToken = getSelectedToken(metamask);
  return selectedToken
    ? global.eth.contract(abi).at(selectedToken.address)
    : null;
}

export function getConversionRate (metamask) {
  return metamask.conversionRate;
}

export function getCurrentNetwork (metamask) {
  return metamask.network;
}

export function getAmountConversionRate (metamask) {
  return getSelectedToken(metamask)
    ? getSelectedTokenToFiatRate(metamask)
    : getConversionRate(metamask);
}

export function getBlockGasLimit (metamask) {
  return metamask.currentBlockGasLimit;
}

export function getPrimaryCurrency (metamask) {
  const selectedToken = getSelectedToken(metamask);
  return selectedToken && selectedToken.symbol;
}

export function getRecentBlocks (metamask) {
  return metamask.recentBlocks;
}

export function getSendEditingTransactionId (send) {
  return send.editingTransactionId;
}

export function getFromBalance (metamask) {
  const from = getSelectedAccount(metamask);
  return from.balance;
}

export function getSendToAccounts (metamask) {
  const fromAccounts = accountsWithSendEtherInfoSelector(metamask);
  const addressBookAccounts = getAddressBook(metamask);
  const allAccounts = [...fromAccounts, ...addressBookAccounts];
  // TODO: figure out exactly what the below returns and put a descriptive variable name on it
  return Object.entries(allAccounts).map(([key, account]) => account);
}

export function getTokenBalance (send) {
  return send.tokenBalance;
}

export function getUnapprovedTxs (metamask) {
  return metamask.unapprovedTxs;
}

