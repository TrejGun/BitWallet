import React, {Component} from "react";
import PropTypes from "prop-types";


export default class Tooltip extends Component {

  static propTypes = {
    position: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    position: "left",
  };

  render () {
    const {children} = this.props;

    return (
      <i>
        {children}
      </i>
    );
  }
}
