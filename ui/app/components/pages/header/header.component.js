import React, {Component, Fragment} from "react";
import Primary from "./primary/index";
import Secondary from "./secondary/index";


export default class Header extends Component {
  render () {
    return (
      <Fragment>
        <Primary/>
        <Secondary />
      </Fragment>
    );
  }
}
