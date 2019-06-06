import React, {Component} from "react";
import {Button} from "react-bootstrap";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";


export default class WrappedButton extends Component {

  static propTypes = {
    title: PropTypes.string,
    copied: PropTypes.bool,
    onClick: PropTypes.func,
    bsStyle: PropTypes.string,
    "data-copied": PropTypes.bool,
  };

  static defaultProps = {
    bsStyle: "link",
  };

  render () {
    const {title, onClick, bsStyle, "data-copied": copied} = this.props;

    return (
      <Button
        onClick={onClick}
        bsStyle={bsStyle}
      >
        <i className={"fa fa-clipboard"}/>
        {" "}
        {copied
          ? <FormattedMessage id="components.copyButton.copied"/>
          : title || <FormattedMessage id="components.copyButton.copy"/>
        }
      </Button>
    );
  }
}
