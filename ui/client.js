import "../app/fonts/FontAwesome/fontawesome.css";
import "../app/fonts/WorkSans/worksans.css";
import "../app/fonts/GlyphIcons/glyphicons.css";

import "./app/css/typography.scss";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "./app/css/index.scss";


import App from "./app/select-app";
import render from "./render";
import configureStore from "./app/store";
import MetamaskController from "../app/scripts/metamask-controller";
import {_setBackgroundConnection} from "./app/actions";
import states from "../development/states.js";
import extension from "extensionizer";
import PortStream from "../app/scripts/lib/port-stream";
import connectToAccountManager from "../app/scripts/popup-utils";


const store = configureStore(states["account detail with transaction history"]);


const noop = Function.prototype;
const controller = new MetamaskController({
  // User confirmation callbacks:
  showUnconfirmedMessage: noop,
  unlockAccountMessage: noop,
  showUnapprovedTx: noop,
  platform: {
    openWindow ({url}) {
      global.open(url);
    },
  },
  // initial state
  initState: {
    config: {},
  },
});

_setBackgroundConnection(controller.getApi());


// TODO FIXME when BitWallet is published
const extensionPort = extension.runtime.connect("keaidnajojoaohcmjepfaoklgjlipcfb", {name: "popup"});
const connectionStream = new PortStream(extensionPort);
connectToAccountManager(connectionStream, () => {
  console.log("connectToAccountManager:cb"); // never saw this called
});

render(App, store);

if (module.hot) {
  module.hot.accept("./app/select-app", () => {
    render(App, store);
  });
}
