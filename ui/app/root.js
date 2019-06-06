import React, {Component} from "react";
import PropTypes from "prop-types";
import {Provider} from "react-intl-redux";
import SelectedApp from "./select-app";


export default class Root extends Component {

  static propTypes = {
    store: PropTypes.object,
  };

  render () {
    const {store} = this.props;

    return (
      <Provider store={store}>
        <SelectedApp/>
      </Provider>
    );
  }
}
