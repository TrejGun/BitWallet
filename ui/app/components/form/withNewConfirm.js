import React, {Component} from "react";
import PropTypes from "prop-types";
import {PASSWORD_MIN_LENGTH} from "./withNewPassword";


export default function withConfirm (WrappedComponent) {
  return class ConfirmFrom extends Component {

    static propTypes = {
      formData: PropTypes.shape({
        newConfirm: PropTypes.string,
        newPassword: PropTypes.string,
      }).isRequired,
      addValidationMessage: PropTypes.func,
      delValidationMessage: PropTypes.func,
      onChange: PropTypes.func,
      isValid: PropTypes.func,
      getValidation: PropTypes.func,
    };


    isValid () {
      const {
        formData: {newConfirm, newPassword},
        isValid,
      } = this.props;

      if (!newPassword || !newConfirm) {
        return false;
      }

      return isValid();
    }

    handlePasswordChange (e) {
      const newPassword = e.target.value;
      const {
        formData: {newConfirm},
        addValidationMessage,
        delValidationMessage,
        onChange,
        getValidation,
      } = this.props;

      if (newPassword && newPassword.length < PASSWORD_MIN_LENGTH) {
        addValidationMessage({
          name: "newPassword",
          reason: "minlength",
        });
      }

      delValidationMessage(getValidation("newConfirm", "match"));

      if (newConfirm && newPassword !== newConfirm) {
        addValidationMessage({
          name: "newConfirm",
          reason: "match",
        });
      }

      onChange(e);
    }

    handleConfirmChange (e) {
      const newConfirm = e.target.value;
      const {
        formData: {newPassword},
        addValidationMessage,
        onChange,
      } = this.props;

      if (newConfirm && newPassword !== newConfirm) {
        addValidationMessage({
          name: "newConfirm",
          reason: "match",
        });
      }

      onChange(e);
    }

    render () {
      const props = this.props;
      return (
        <WrappedComponent
          {...props}
          isValid={::this.isValid}
          handlePasswordChange={::this.handlePasswordChange}
          handleConfirmChange={::this.handleConfirmChange}
        />
      );
    }
  };
}
