import React, {Component} from "react";
import PropTypes from "prop-types";


export const PASSWORD_MIN_LENGTH = 8;

export default function withNewPassword (WrappedComponent) {
  return class NewPasswordFrom extends Component {

    static propTypes = {
      formData: PropTypes.shape({
        newPassword: PropTypes.string,
      }).isRequired,
      addValidationMessage: PropTypes.func,
      onChange: PropTypes.func,
      isValid: PropTypes.func,
    };

    isValid () {
      const {
        formData: {newPassword},
        isValid,
      } = this.props;

      if (!newPassword) {
        return false;
      }

      return isValid();
    }

    handlePasswordChange (e) {
      const newPassword = e.target.value;
      const {addValidationMessage, onChange} = this.props;

      if (newPassword && newPassword.length < PASSWORD_MIN_LENGTH) {
        addValidationMessage({
          name: "newPassword",
          reason: "minlength",
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
        />
      );
    }
  };
}
