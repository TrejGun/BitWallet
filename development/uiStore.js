import {createStore, applyMiddleware} from "redux";
import thunkMiddleware from "redux-thunk";
import {createLogger} from "redux-logger";
import rootReducer from "../ui/app/reducers";

const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore);

export default function configureStore (initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("../ui/app/reducers", () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
