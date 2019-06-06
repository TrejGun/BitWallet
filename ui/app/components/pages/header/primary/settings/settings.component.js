import React, {Component} from "react";
import {Glyphicon} from "react-bootstrap";
import {Link, matchPath} from "react-router-dom";
import PropTypes from "prop-types";
import {INITIALIZE_ROUTE, SETTINGS_ROUTE} from "../../../../../routes";


export default class Brand extends Component {

  static propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
  };

  render () {
    const {location} = this.props;

    const isInitializing = Boolean(matchPath(location.pathname, {
      path: INITIALIZE_ROUTE,
      exact: false,
    }));

    if (isInitializing) {
      return null;
    }

    return (
      <Link className="settings" to={SETTINGS_ROUTE}>
        <Glyphicon glyph="cog"/>
      </Link>
    );
  }
}
