import React from "react";
import {render} from "react-dom";
import Root from "./app/root";
import {
  _setBackgroundConnection,
  showConfTxPage,
  updateMetamaskState,
  updateCurrentLocale,
  setProviderType,
} from "./app/actions";
import configureStore from "./app/store";
import txHelper from "./lib/tx-helper";
import log from "loglevel";
import {defaultLanguage, enabledLanguages} from "./app/localization/constants";
import {localization} from "./app/localization/setup";


log.setLevel(global.METAMASK_DEBUG ? "debug" : "warn");

export default function launchMetamaskUi (opts, cb) {
  var accountManager = opts.accountManager;
  _setBackgroundConnection(accountManager);
  // check if we are unlocked first
  accountManager.getState(function (err, metamaskState) {
    if (err) return cb(err);
    startApp(metamaskState, accountManager, opts)
      .then((store) => {
        cb(null, store);
      });
  });
}

async function startApp (metamaskState, accountManager, opts) {
  // parse opts
  if (!metamaskState.featureFlags) metamaskState.featureFlags = {};

  const store = configureStore({

    // metamaskState represents the cross-tab state
    metamask: metamaskState,

    // appState represents the current tab's popup state
    appState: {},

    intl: {
      locale: defaultLanguage,
      defaultLocale: defaultLanguage,
      enabledLanguages,
      ...(localization[defaultLanguage] || {}),
    },

    // Which blockchain we are using:
    networkVersion: opts.networkVersion,
  });

  // if unconfirmed txs, start on txConf page
  const unapprovedTxsAll = txHelper(metamaskState.unapprovedTxs, metamaskState.unapprovedMsgs, metamaskState.unapprovedPersonalMsgs, metamaskState.unapprovedTypedMessages, metamaskState.network);
  const numberOfUnapprivedTx = unapprovedTxsAll.length;
  if (numberOfUnapprivedTx > 0) {
    store.dispatch(showConfTxPage({
      id: unapprovedTxsAll[numberOfUnapprivedTx - 1].id,
    }));
  }

  accountManager.on("update", function (metamaskState) {
    store.dispatch(updateMetamaskState(metamaskState));
  });

  // global metamask api - used by tooling
  global.metamask = {
    updateCurrentLocale: (code) => {
      store.dispatch(updateCurrentLocale(code));
    },
    setProviderType: (type) => {
      store.dispatch(setProviderType(type));
    },
  };

  // start app
  render(<Root store={store}/>, opts.container);

  return store;
}
