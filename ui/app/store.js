import {createStore, applyMiddleware, compose} from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers";
import {createLogger} from "redux-logger";
import {composeWithDevTools} from "redux-devtools-extension";


global.METAMASK_DEBUG = process.env.METAMASK_DEBUG;

const loggerMiddleware = createLogger({
  predicate: () => global.METAMASK_DEBUG,
});

let composeEnhancers = compose;

if (true || process.env.NODE_ENV === "development") {
  composeEnhancers = composeWithDevTools;
}

const middlewares = [thunkMiddleware, loggerMiddleware];


export default function configureStore (initialState) {
  const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./reducers", () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
