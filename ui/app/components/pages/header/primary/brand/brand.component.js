import React, {Component} from "react";
import {Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import {DEFAULT_ROUTE} from "../../../../../routes";


export default class Brand extends Component {
  render () {
    return (
      <Navbar.Brand>
        <Link to={DEFAULT_ROUTE}>
          <FormattedMessage id="app.name" />
        </Link>
      </Navbar.Brand>
    );
  }
}
