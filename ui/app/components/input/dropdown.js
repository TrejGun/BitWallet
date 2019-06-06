import React, {Component} from "react";
import PropTypes from "prop-types";
import {DropdownButton} from "react-bootstrap";
import {omit} from "lodash";


export default class Dropdown extends Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.array,
    onSelect: PropTypes.func,
    renderItem: PropTypes.func,
  };

  static defaultProps = {
    value: "",
    // defaultValue: "",
    options: [],
    onSelect: Function.prototype,
    renderItem: Function.prototype,
  };

  onSelect (eventKey) {
    const {onSelect, options} = this.props;
    onSelect(options[eventKey]);
  }

  render () {
    const {name, value, options, renderItem} = this.props;
    const props = omit(this.props, ["value", "options", "renderItem", "onSelect"]);

    return (
      <DropdownButton
        id={name}
        title={value}
        onSelect={::this.onSelect}
        {...props}
      >
        {options.map(renderItem)}
      </DropdownButton>
    );
  }
}
