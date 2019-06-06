/* MOCK DEV
 *
 * This is a utility module.
 * It initializes a minimalist browserifiable project
 * that contains the Metamask UI, with a local background process.
 *
 * Includes a state reset button for restoring to initial state.
 *
 * This is a convenient way to develop and test the plugin
 * without having to re-open the plugin or even re-build it.
 *
 * To use, run `npm run mock`.
 */

import React from "react";
import {render} from "react-dom";
import Root from "../ui/app/root";
import configureStore from "../ui/app/store";
import {_setBackgroundConnection} from "../ui/app/actions";
import states from "./states";
import backGroundConnectionModifiers from "./backGroundConnectionModifiers";
import Selector from "./selector";
import MetamaskController from "../app/scripts/metamask-controller";
import firstTimeState from "../app/scripts/first-time-state";
import ExtensionPlatform from "../app/scripts/platforms/extension";
import MetaMaskUiCss from "../ui/css";
import injectCss from "inject-css";
import qs from "qs";
import log from "loglevel";

const noop = function () {};

window.log = log;
log.setLevel("debug");

//
// Query String
//


const routerPath = window.location.href.split("#")[1];
let queryString = {};
let selectedView;

if (routerPath) {
  queryString = qs.parse(routerPath.split("?")[1]);
}

selectedView = queryString.view || "first time";
const firstState = states[selectedView];
updateQueryParams(selectedView);

function updateQueryParams (newView) {
  queryString.view = newView;
  const params = qs.stringify(queryString);
  const locationPaths = window.location.href.split("#");
  const routerPath = locationPaths[1] || "";
  const newPath = locationPaths[0] + "#" + routerPath.split("?")[0] + `?${params}`;

  if (window.location.href !== newPath) {
    window.location.href = newPath;
  }
}

//
// MetaMask Controller
//

const controller = new MetamaskController({
  // User confirmation callbacks:
  showUnconfirmedMessage: noop,
  unlockAccountMessage: noop,
  showUnapprovedTx: noop,
  platform: {},
  // initial state
  initState: firstTimeState,
});
global.metamaskController = controller;
global.platform = new ExtensionPlatform();

//
// User Interface
//

_setBackgroundConnection(controller.getApi());

function update (stateName) {
  selectedView = stateName;
  updateQueryParams(stateName);
  const newState = states[selectedView];
  return {
    type: "GLOBAL_FORCE_UPDATE",
    value: newState,
  };
}

function modifyBackgroundConnection (backgroundConnectionModifier) {
  const modifiedBackgroundConnection = Object.assign({}, controller.getApi(), backgroundConnectionModifier);
  _setBackgroundConnection(modifiedBackgroundConnection);
}

var css = MetaMaskUiCss();
injectCss(css);

// parse opts
var store = configureStore(firstState);

// start app
startApp();

function startApp () {
  const body = document.body;
  const container = document.createElement("div");
  container.id = "test-container";
  body.appendChild(container);

  render(
    <div className="super-dev-container">
      <button onClick={e => {
        e.preventDefault();
        store.dispatch(update("terms"));
      }}>
        Reset State
      </button>
      <Selector
        update={update}
        selectedKey={selectedView}
        states={states}
        store={store}
        modifyBackgroundConnection={modifyBackgroundConnection}
        backGroundConnectionModifiers={backGroundConnectionModifiers}
      />
      <div id="app">
        <Root store={store} />
      </div>
    </div>, container);
}
