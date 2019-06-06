import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import {Button, FormControl} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


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
    const props = this.props;
    return (
      <Fragment>
        <Button bsStyle="primary">
          <FormControl
            {...props}
          />
          <FormattedMessage id="buttons.browse"/>
        </Button>
      </Fragment>
    );
  }
}
