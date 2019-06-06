import copyToClipboard from "copy-to-clipboard";
import {combineReducers} from "redux";
import {intlReducer} from "react-intl-redux";
import reduceMetamask from "./metamask";
import reduceApp from "./app";
import reduceSend from "./send";
import reduceValidation from "./validation";


global.METAMASK_CACHED_LOG_STATE = null;

export default combineReducers({
  intl: intlReducer,
  send: reduceSend,
  metamask: reduceMetamask,
  appState: reduceApp,
  validations: reduceValidation,
});

global.logStateString = function (cb) {
  const state = global.METAMASK_CACHED_LOG_STATE;
  const version = global.platform.getVersion();
  const browser = window.navigator.userAgent;
  return global.platform.getPlatformInfo((err, platform) => {
    if (err) {
      return cb(err);
    }
    state.version = version;
    state.platform = platform;
    state.browser = browser;
    const stateString = JSON.stringify(state, removeSeedWords, 2);
    return cb(null, stateString);
  });
};

global.logState = function (toClipboard) {
  return global.logStateString((err, result) => {
    if (err) {
      console.error(err.message);
    } else if (toClipboard) {
      copyToClipboard(result);
      console.log("State log copied");
    } else {
      console.log(result);
    }
  });
};

function removeSeedWords (key, value) {
  return key === "seedWords" ? undefined : value;
}
