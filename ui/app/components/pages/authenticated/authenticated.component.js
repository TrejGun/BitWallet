import React, {Component} from "react";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";
import MetamaskRoute from "../metamask-route";
import {INITIALIZE_ROUTE, UNLOCK_ROUTE} from "../../../routes";


export default class AuthenticatedComponent extends Component {

  static propTypes = {
    isUnlocked: PropTypes.bool,
    isInitialized: PropTypes.bool,
  };

  render () {
    const {isUnlocked, isInitialized} = this.props;

    switch (true) {
      case isUnlocked && isInitialized:
        return (
          <MetamaskRoute {...this.props} />
        );
      case !isInitialized:
        return (
          <Redirect to={{pathname: INITIALIZE_ROUTE}}/>
        );
      default:
        return (
          <Redirect to={{pathname: UNLOCK_ROUTE}}/>
        );
    }
  }
}
