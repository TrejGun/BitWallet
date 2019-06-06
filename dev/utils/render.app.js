import HTML from "../../ui/app/HTML";
import {renderHTML, renderInitialMarkup} from "./render";
import App from "../../ui/app/select-app";
import configureStore from "../../ui/app/store";


export function renderAppToString (request, response) {
  const preloadedState = {};

  const store = configureStore(preloadedState);

  const context = {};

  const initialMarkup = renderInitialMarkup(request.url, store, context, App);

  // context.url will contain the URL to redirect to if a <Redirect> was used
  if (context.url) {
    response.redirect(302, context.url);
  } else {
    response.status(200).send(renderHTML(initialMarkup, store, HTML));
  }
}
