import React from "react";
import {renderToStaticMarkup, renderToString} from "react-dom/server";


export function renderInitialMarkup (url, store, context, App) {
  return renderToString(
    <App />
  )
}

export function renderHTML (initialMarkup, store, Wrapper) {
  return `<!doctype html>\n${renderToStaticMarkup(
    <Wrapper initialMarkup={initialMarkup} initialState={store.getState()} />
  )}`
}
