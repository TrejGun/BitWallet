import React, {Component} from "react";
import PropTypes from "prop-types";
import {FormControl} from "react-bootstrap";
import {injectIntl, intlShape} from "react-intl";
import {omit} from "lodash";


@injectIntl
export default class Input extends Component {
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
    placeholderData: PropTypes.object,
    intl: intlShape,
  };

  static defaultProps = {
    // value: "",
    // defaultValue: "",
    componentClass: "input",
    type: "text",
    multiple: false,
    disabled: false,
    autoComplete: null,
    onChange: Function.prototype,
  };

  render () {
    const {children, intl, name, placeholderData} = this.props;
    const props = omit(this.props, ["intl", "placeholderData"]);
    const placeholder = intl.formatMessage({
      id: `fields.${name}.placeholder`,
      defaultMessage: " ",
    }, placeholderData);
    return (
      <FormControl
        placeholder={placeholder}
        {...props}
      >
        {children}
      </FormControl>
    );
  }
}
