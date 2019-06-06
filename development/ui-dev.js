/* UI DEV
 *
 * This is a utility module.
 * It initializes a minimalist browserifiable project
 * that contains the Metamask UI, with a mocked state.
 *
 * Includes a state menu for switching between different
 * mocked states, along with query param support,
 * so those states are preserved when live-reloading.
 *
 * This is a convenient way to develop on the UI
 * without having to re-enter your password
 * every time the plugin rebuilds.
 *
 * To use, run `npm run ui`.
 */

import React from "react";
import {render} from "react-dom";
import Root from "../ui/app/root";
import configureStore from "./uiStore";
import states from "./states";
import Selector from "./selector";
import log from "loglevel";
import qs from "qs";
import MetaMaskUiCss from "../ui/css";
import injectCss from "inject-css";


// logger
window.log = log;
log.setDefaultLevel(1);

// Query String
const queryString = qs.parse(window.location.href.split("#")[1]);
let selectedView = queryString.view || "first time";
updateQueryParams(selectedView);

function updateQueryParams (newView) {
  queryString.view = newView;
  const params = qs.stringify(queryString);
  window.location.href = window.location.href.split("#")[0] + `#${params}`;
}


function update (stateName) {
  selectedView = stateName;
  updateQueryParams(stateName);
  const newState = states[selectedView];
  return {
    type: "GLOBAL_FORCE_UPDATE",
    value: newState,
  };
}


const css = MetaMaskUiCss();
injectCss(css);

// parse opts
const store = configureStore(states[selectedView]);

// start app
startApp();

function startApp () {
  const body = document.body;
  const container = document.createElement("div");
  container.id = "test-container";
  body.appendChild(container);

  render(
    <div className="super-dev-container">
      <Selector
        update={update}
        selectedKey={selectedView}
        states={states}
        store={store}
      />
      <div id="app">
        <Root store={store} />
      </div>
    </div>, container);
}

