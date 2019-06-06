import async from "async";
import launchMetamaskUi from "../../ui";
import connectToAccountManager from "./popup-utils";


/**
 * Asynchronously initializes the MetaMask popup UI
 *
 * @param {{ container: Element, connectionStream: * }} config Popup configuration object
 * @param {Function} cb Called when initialization is complete
 */
export default function initializePopup ({container, connectionStream}, cb) {
  // setup app
  async.waterfall([
    (cb) => connectToAccountManager(connectionStream, cb),
    (accountManager, cb) => launchMetamaskUi({container, accountManager}, cb),
  ], cb);
}

