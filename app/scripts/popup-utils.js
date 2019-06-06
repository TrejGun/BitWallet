import {EventEmitter} from "events";
import Dnode from "dnode/browser";
import Eth from "ethjs";
import EthQuery from "eth-query";
import StreamProvider from "web3-stream-provider";
import {setupMultiplex} from "./lib/stream-utils";


/**
 * Establishes streamed connections to background scripts and a Web3 provider
 *
 * @param {PortDuplexStream} connectionStream PortStream instance establishing a background connection
 * @param {Function} cb Called when controller connection is established
 */
export default function connectToAccountManager (connectionStream, cb) {
  // setup communication with background
  // setup multiplexing
  var mx = setupMultiplex(connectionStream);
  // connect features
  setupControllerConnection(mx.createStream("controller"), cb);
  setupWeb3Connection(mx.createStream("provider"));
}

/**
 * Establishes a streamed connection to a Web3 provider
 *
 * @param {PortDuplexStream} connectionStream PortStream instance establishing a background connection
 */
function setupWeb3Connection (connectionStream) {
  var providerStream = new StreamProvider();
  providerStream.pipe(connectionStream).pipe(providerStream);
  connectionStream.on("error", console.error.bind(console));
  providerStream.on("error", console.error.bind(console));
  global.ethereumProvider = providerStream;
  global.ethQuery = new EthQuery(providerStream);
  global.eth = new Eth(providerStream);
}

/**
 * Establishes a streamed connection to the background account manager
 *
 * @param {PortDuplexStream} connectionStream PortStream instance establishing a background connection
 * @param {Function} cb Called when the remote account manager connection is established
 */
function setupControllerConnection (connectionStream, cb) {
  // this is a really sneaky way of adding EventEmitter api
  // to a bi-directional dnode instance
  var eventEmitter = new EventEmitter();
  var accountManagerDnode = Dnode({
    sendUpdate: function (state) {
      eventEmitter.emit("update", state);
    },
  });
  connectionStream.pipe(accountManagerDnode).pipe(connectionStream);
  accountManagerDnode.once("remote", function (accountManager) {
    // setup push events
    accountManager.on = eventEmitter.on.bind(eventEmitter);
    cb(null, accountManager);
  });
}
