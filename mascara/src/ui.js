import injectCss from "inject-css";
import SwController from "sw-controller";
import SwStream from "sw-stream";
import MetaMaskUiCss from "../../ui/css";
import MetamascaraPlatform from "../../app/scripts/platforms/window";
import startPopup from "../../app/scripts/popup-core";

// create platform global
global.platform = new MetamascaraPlatform();

var css = MetaMaskUiCss();
injectCss(css);
const container = document.getElementById("app");

const name = "popup";
window.METAMASK_UI_TYPE = name;
window.METAMASK_PLATFORM_TYPE = "mascara";

const keepAliveDelay = Math.floor(Math.random() * (30000 - 1000)) + 1000;

const swController = new SwController({
  fileName: "./background.js",
  keepAlive: true,
  keepAliveDelay,
  keepAliveInterval: 20000,
});

swController.once("updatefound", windowReload);
swController.once("ready", async () => {
  try {
    swController.removeListener("updatefound", windowReload);
    console.log("swController ready");
    await timeout(1000);
    console.log("connecting to app");
    await connectApp();
    console.log("app connected");
  } catch (err) {
    console.error(err);
  }
});

console.log("starting service worker");
swController.startWorker();

// Setup listener for when the service worker is read
function connectApp () {
  const connectionStream = SwStream({
    serviceWorker: swController.getWorker(),
    context: name,
  });
  return new Promise((resolve, reject) => {
    startPopup({container, connectionStream}, (err, store) => {
      console.log("hello from MetaMascara ui!");
      if (err) reject(err);
      store.subscribe(() => {
        const state = store.getState();
        if (state.appState.shouldClose) window.close();
      });
      resolve();
    });
  });
}

function windowReload () {
  if (window.METAMASK_SKIP_RELOAD) return;
  window.location.reload();
}

function timeout (time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time || 1500);
  });
}
