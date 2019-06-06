import React, {Component} from "react";
import PropTypes from "prop-types";
import {InputGroup} from "react-bootstrap";


export default function withAddons (Input) {
  return class InputAddons extends Component {
    static propTypes = {
      before: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.element,
      ]),
      after: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.element,
      ]),
      beforeButton: PropTypes.element,
      afterButton: PropTypes.element,
    };

    render () {
      const {before, beforeButton, after, afterButton, ...props} = this.props;
      return (
        <InputGroup>
          {this.wrapAddon(before)}
          {this.wrapButton(beforeButton)}
          <Input {...props} />
          {this.wrapAddon(after)}
          {this.wrapButton(afterButton)}
        </InputGroup>
      );
    }

    wrapAddon (addon) {
      if (!addon) {
        return null;
      }

      return (
        <InputGroup.Addon>{addon}</InputGroup.Addon>
      );
    }

    wrapButton (button) {
      if (!button) {
        return null;
      }
      return (
        <InputGroup.Button>{button}</InputGroup.Button>
      );
    }
  };
}

