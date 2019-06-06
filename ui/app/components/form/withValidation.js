import React, {Component} from "react";
import PropTypes from "prop-types";
import {addValidationMessage, delValidationMessage} from "../input/actions";
import {connect} from "react-redux";
import {omit} from "lodash";


function mapStateToProps ({validations}) {
  return {
    validations,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    addValidationMessage: (message) => dispatch(addValidationMessage(message)),
    delValidationMessage: (message) => dispatch(delValidationMessage(message)),
  };
}

export default function withValidation (WrappedComponent) {
  @connect(mapStateToProps, mapDispatchToProps)
  class ValidatedForm extends Component {

    static propTypes = {
      delValidationMessage: PropTypes.func,
      addValidationMessage: PropTypes.func,
      validations: PropTypes.array,
    };

    getValidation (name, reason) {
      const {validations} = this.props;
      return validations.find(validation => validation.name === name && (reason ? validation.reason === reason : true));
    }

    isValid () {
      const {validations} = this.props;
      return !validations.length;
    }

    render () {
      const props = omit(this.props, ["validations"]);

      return (
        <WrappedComponent
          {...props}
          isValid={::this.isValid}
          getValidation={::this.getValidation}
        />
      );
    }
  }

  return ValidatedForm;
}
