import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";
import {INITIALIZE_ROUTE} from "../../routes";
import MetamaskRoute from "./metamask-route";


class Initialized extends Component {
  static propTypes = {
    isInitialized: PropTypes.bool,
  };

  render () {
    const {isInitialized} = this.props;

    if (isInitialized) {
      return (
        <MetamaskRoute {...this.props} />
      );
    } else {
      return (
        <Redirect to={{pathname: INITIALIZE_ROUTE}} />
      );
    }
  }
}

function mapStateToProps (state) {
  const {metamask: {isInitialized}} = state;
  return {
    isInitialized,
  };
}

export default connect(mapStateToProps)(Initialized);
