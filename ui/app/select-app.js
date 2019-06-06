import React, {Component} from "react";
import {HashRouter} from "react-router-dom";
import App from "./app.container";


export default class SelectedApp extends Component {
  render () {
    return (
      <HashRouter hashType="noslash">
        <App />
      </HashRouter>
    );
  }
}
