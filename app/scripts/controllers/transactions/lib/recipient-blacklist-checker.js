import Config from "./recipient-blacklist.js";

/**
 * Checks if a specified account on a specified network is blacklisted.
  @param networkId {number}
  @param account {string}
*/
export default function checkAccount (networkId, account) {

  const mainnetId = 1;
  if (networkId !== mainnetId) {
    return;
  }

  const accountToCheck = account.toLowerCase();
  if (Config.blacklist.includes(accountToCheck)) {
    throw new Error("Recipient is a public account");
  }
}
