import React, {Component} from "react";
import {Button} from "react-bootstrap";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";


export default class BackButton extends Component {

  static propTypes = {
    text: PropTypes.string,
    show: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    text: "back",
    show: true,
  };

  onClick (e) {
    e.preventDefault();
    const {onClick} = this.props;
    onClick();
  }

  render () {
    const {text, show} = this.props;

    if (!show) {
      return null;
    }

    return (
      <Button bsStyle="link" className="back" onClick={::this.onClick}>
        &larr; <FormattedMessage id={`buttons.${text}`} />
      </Button>
    );
  }
}
