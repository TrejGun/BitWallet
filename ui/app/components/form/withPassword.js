import React, {Component} from "react";
import PropTypes from "prop-types";


export default function withPassword (WrappedComponent) {
  return class PasswordFrom extends Component {

    static propTypes = {
      formData: PropTypes.shape({
        password: PropTypes.string,
      }).isRequired,
      onChange: PropTypes.func,
      isValid: PropTypes.func,
    };

    isValid () {
      const {
        formData: {password},
        isValid,
      } = this.props;

      if (!password) {
        return false;
      }

      return isValid();
    }

    handlePasswordChange (e) {
      const {onChange} = this.props;

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
