global.window = global;

import SwGlobalListener from "sw-stream/lib/sw-global-listener.js";
import {setupMultiplex} from "../../app/scripts/lib/stream-utils.js";
import DbController from "idb-global";
import SwPlatform from "../../app/scripts/platforms/sw";
import MetamaskController from "../../app/scripts/metamask-controller";
import Migrator from "../../app/scripts/lib/migrator/";
import migrations from "../../app/scripts/migrations/";
import firstTimeState from "../../app/scripts/first-time-state";
import log from "loglevel";

const connectionListener = new SwGlobalListener(global);

const STORAGE_KEY = "metamask-config";
const METAMASK_DEBUG = process.env.METAMASK_DEBUG;
global.metamaskPopupIsOpen = false;


global.log = log;
log.setDefaultLevel(METAMASK_DEBUG ? "debug" : "warn");

global.addEventListener("install", function (event) {
  event.waitUntil(global.skipWaiting());
});
global.addEventListener("activate", function (event) {
  event.waitUntil(global.clients.claim());
});

log.debug("inside:open");

// state persistence
const dbController = new DbController({
  key: STORAGE_KEY,
});

start().catch(log.error);

async function start () {
  log.debug("MetaMask initializing...");
  const initState = await loadStateFromPersistence();
  await setupController(initState);
  log.debug("MetaMask initialization complete.");
}

//
// State and Persistence
//
async function loadStateFromPersistence () {
  // migrations
  const migrator = new Migrator({migrations});
  const initialState = migrator.generateInitialState(firstTimeState);
  dbController.initialState = initialState;
  const versionedData = await dbController.open();
  const migratedData = await migrator.migrateData(versionedData);
  await dbController.put(migratedData);
  return migratedData.data;
}

async function setupController (initState, client) {

  //
  // MetaMask Controller
  //

  const platform = new SwPlatform();

  const controller = new MetamaskController({
    // platform specific implementation
    platform,
    // User confirmation callbacks:
    showUnconfirmedMessage: noop,
    unlockAccountMessage: noop,
    showUnapprovedTx: noop,
    // initial state
    initState,
  });
  global.metamaskController = controller;

  controller.store.subscribe(async (state) => {
    try {
      const versionedData = await versionifyData(state);
      await dbController.put(versionedData);
    } catch (e) {console.error("METAMASK Error:", e);}
  });

  async function versionifyData (state) {
    const rawData = await dbController.get();
    return {
      data: state,
      meta: rawData.meta,
    };
  }

  //
  // connect to other contexts
  //

  connectionListener.on("remote", (portStream, messageEvent) => {
    log.debug("REMOTE CONECTION FOUND***********");
    connectRemote(portStream, messageEvent.data.context);
  });

  function connectRemote (connectionStream, context) {
    var isMetaMaskInternalProcess = (context === "popup");
    if (isMetaMaskInternalProcess) {
      // communication with popup
      controller.setupTrustedCommunication(connectionStream, "MetaMask");
      global.metamaskPopupIsOpen = true;
    } else {
      // communication with page
      setupUntrustedCommunication(connectionStream, context);
    }
  }

  function setupUntrustedCommunication (connectionStream, originDomain) {
    // setup multiplexing
    var mx = setupMultiplex(connectionStream);
    // connect features
    controller.setupProviderConnection(mx.createStream("provider"), originDomain);
    controller.setupPublicConfig(mx.createStream("publicConfig"));
  }
}
// // this will be useful later but commented out for linting for now (liiiinting)
// function sendMessageToAllClients (message) {
//   global.clients.matchAll().then(function (clients) {
//     clients.forEach(function (client) {
//       client.postMessage(message)
//     })
//   })
// }

function noop () {}
