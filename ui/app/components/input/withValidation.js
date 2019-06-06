import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {omit} from "lodash";
import {injectIntl, intlShape} from "react-intl";
import {delValidationMessage} from "./actions";


export default function withValidation (Input) {
  @injectIntl
  @connect(
    state => ({
      validations: state.validations,
    }),
    dispatch => ({
      delValidationMessage (message) {
        dispatch(delValidationMessage(message));
      },
    }),
  )
  class InputWithValidation extends Component {
    static propTypes = {
      validations: PropTypes.array,
      onChange: PropTypes.func,
      dispatch: PropTypes.func,
      delValidationMessage: PropTypes.func,
      name: PropTypes.string,
      intl: intlShape,
    };

    static defaultProps = {
      validations: [],
      onChange: Function.prototype,
    };

    componentWillUnmount () {
      const {name, delValidationMessage} = this.props;
      const validation = this.getValidation(name);
      if (validation) {
        delValidationMessage(validation);
      }
    }

    onChange (e) {
      const {name, onChange, delValidationMessage} = this.props;
      const validation = this.getValidation(name);
      if (validation) {
        delValidationMessage(validation);
      }
      onChange(e);
    }

    getValidation (name) {
      const {validations} = this.props;
      return validations.find(validation => validation.name === name);
    }

    render () {
      const {name, intl} = this.props;
      const props = omit(this.props, ["validations", "delValidationMessage", "dispatch", "intl"]);
      const validation = this.getValidation(name);
      return (
        <Input
          {...props}
          onChange={::this.onChange}
          validation={validation}
          onInvalid={e => {
            e.target.parentNode.parentNode.classList.add("has-error");
            if (e.target.validity.valueMissing) {
              e.target.setCustomValidity(intl.formatMessage({
                id: `fields.${name}.required`,
              }));
            } else if (e.target.validity.typeMismatch) {
              e.target.setCustomValidity(intl.formatMessage({
                id: `fields.${name}.invalid`,
              }));
            } else if (e.target.validity.tooShort) {
              e.target.setCustomValidity(intl.formatMessage({
                id: `fields.${name}.minlength`,
              }));
            } else if (e.target.validity.tooLong) {
              e.target.setCustomValidity(intl.formatMessage({
                id: `fields.${name}.maxlength`,
              }));
            }
          }}
          onInput={e => {
            if (validation) {
              return;
            }
            e.target.parentNode.parentNode.classList.remove("has-error");
            e.target.setCustomValidity("");
          }}
        />
      );
    }
  }

  return InputWithValidation;
}
