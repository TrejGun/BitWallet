import injectCss from "inject-css";
import extension from "extensionizer";
import log from "loglevel";
import NewMetaMaskUiCss from "../../ui/css";
import startPopup from "./popup-core";
import PortStream from "./lib/port-stream.js";
import {getEnvironmentType} from "./lib/util";
import {ENVIRONMENT_TYPE_NOTIFICATION} from "./lib/enums";
import ExtensionPlatform from "./platforms/extension";
import NotificationManager from "./lib/notification-manager";
import setupRaven from "./lib/setupRaven";


const notificationManager = new NotificationManager();

start().catch(log.error);

async function start () {

  // create platform global
  global.platform = new ExtensionPlatform();

  // setup sentry error reporting
  const release = global.platform.getVersion();
  setupRaven({release});

  // inject css
  // const css = MetaMaskUiCss()
  // injectCss(css)

  // identify window type (popup, notification)
  const windowType = getEnvironmentType(window.location.href);
  global.METAMASK_UI_TYPE = windowType;
  closePopupIfOpen(windowType);

  // setup stream to background
  const extensionPort = extension.runtime.connect({name: windowType});
  const connectionStream = new PortStream(extensionPort);

  // start ui
  const container = document.getElementById("app");
  startPopup({container, connectionStream}, (err, store) => {
    if (err) return displayCriticalError(err);

    injectCss(NewMetaMaskUiCss());

    store.subscribe(() => {
      const state = store.getState();
      if (state.appState.shouldClose) notificationManager.closePopup();
    });
  });


  function closePopupIfOpen (windowType) {
    if (windowType !== ENVIRONMENT_TYPE_NOTIFICATION) {
      // should close only chrome popup
      notificationManager.closePopup();
    }
  }

  function displayCriticalError (err) {
    container.innerHTML = '<div class="critical-error">The MetaMask app failed to load: please open and close MetaMask again to restart.</div>';
    container.style.height = "80px";
    log.error(err.stack);
    throw err;
  }

}
