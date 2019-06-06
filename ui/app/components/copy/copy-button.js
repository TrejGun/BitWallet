import React, {Component} from "react";
import WrappedButton from "./wrapped-button";
import Copyable from "./copyable";
import PropTypes from "prop-types";


export default class CopyButton extends Component {

  static propTypes = {
    value: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
    bsStyle: PropTypes.string,
    "data-copied": PropTypes.bool,
  };

  render () {
    const {value, title, onClick, bsStyle, "data-copied": copied} = this.props;

    return (
      <Copyable value={value}>
        <WrappedButton title={title} onClick={onClick} bsStyle={bsStyle} data-copied={copied}/>
      </Copyable>
    );
  }
}
