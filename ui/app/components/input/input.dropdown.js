import React, {Component} from "react";
import PropTypes from "prop-types";
import {DropdownButton, FormControl, InputGroup} from "react-bootstrap";
import {omit} from "lodash";


export default class InputDropdown extends Component {
  static propTypes = {
    componentClass: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    name: PropTypes.string,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    children: PropTypes.node,
    autoComplete: PropTypes.string,

    options: PropTypes.array,
    onSelect: PropTypes.func,
    renderItem: PropTypes.func,
  };

  static defaultProps = {
    value: "",
    // defaultValue: "",
    options: [],
    type: "text",
    onSelect: Function.prototype,
    renderItem: Function.prototype,
  };

  onSelect (eventKey) {
    const {onSelect, options} = this.props;
    onSelect(options[eventKey]);
  }

  render () {
    const {name, options, renderItem} = this.props;
    const IIprops = omit(this.props, ["options", "renderItem", "onSelect"]);
    const DDprops = omit(this.props, ["value", "options", "renderItem", "onSelect", "onChange", "type"]);

    return (
      <InputGroup>
        <FormControl
          {...IIprops}
        />
        <DropdownButton
          id={name}
          title=""
          componentClass={InputGroup.Button}
          onSelect={::this.onSelect}
          pullRight
          {...DDprops}
        >
          {options.map(renderItem)}
        </DropdownButton>
      </InputGroup>
    );
  }
}
