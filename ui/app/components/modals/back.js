import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";


export default class BackButton extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    label: "Back",
  };

  render () {
    const {label, onClick} = this.props;
    return (
      <Button type="button" className="back" onClick={onClick}>
        <span aria-hidden="true">&larr;</span>
        <span className="sr-only">{label}</span>
      </Button>
    );
  }
}
