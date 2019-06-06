import React, {Component} from "react";
import {Navbar} from "react-bootstrap";
import Brand from "./brand/index";
import Settings from "./settings/index";


export default class Primary extends Component {
  render () {
    return (
      <Navbar className="primary">
        <Navbar.Header>
          <Brand/>
          <Settings/>
        </Navbar.Header>
      </Navbar>
    );
  }
}
