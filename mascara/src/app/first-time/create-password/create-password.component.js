import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  INITIALIZE_IMPORT_ROUTE,
  INITIALIZE_NOTICE_ROUTE,
  INITIALIZE_UNIQUE_IMAGE_ROUTE,
} from "../../../../../ui/app/routes";
import {Button, ButtonToolbar, Form} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import {PASSWORD_MIN_LENGTH} from "../../../../../ui/app/components/form/withNewPassword";
import Input from "../../../../../ui/app/components/input/input.group.validation";


export default class CreatePassword extends Component {

  static propTypes = {
    isLoading: PropTypes.bool,
    createAccount: PropTypes.func,
    history: PropTypes.object,
    isInitialized: PropTypes.bool,
    formData: PropTypes.shape({
      newPassword: PropTypes.string,
      newConfirm: PropTypes.string,
    }),
    delValidationMessage: PropTypes.func,
    addValidationMessage: PropTypes.func,
    handlePasswordChange: PropTypes.func,
    handleConfirmChange: PropTypes.func,
    onChange: PropTypes.func,
    isValid: PropTypes.func,
  };

  componentWillMount () {
    const {isInitialized, history} = this.props;

    if (isInitialized) {
      history.push(INITIALIZE_NOTICE_ROUTE);
    }
  }

  onSubmit (e) {
    e.preventDefault();

    if (!this.isValid()) {
      return;
    }

    const {formData: {newPassword}, createAccount, history} = this.props;

    this.setState({isLoading: true});
    createAccount(newPassword)
      .then(() => history.push(INITIALIZE_UNIQUE_IMAGE_ROUTE));
  }

  isValid () {
    const {isValid} = this.props;
    return isValid();
  }

  onClick (e) {
    e.preventDefault();
    const {history} = this.props;
    history.push(INITIALIZE_IMPORT_ROUTE);
  }

  render () {
    const {
      formData: {newPassword, newConfirm},
      handlePasswordChange,
      handleConfirmChange,
    } = this.props;

    return (
      <Form className="create-password" onSubmit={::this.onSubmit}>
        <div className="first-time-flow__title">
          <FormattedMessage id="pages.createPassword.title"/>
        </div>

        <Input
          name="newPassword"
          type="password"
          placeholderData={{length: PASSWORD_MIN_LENGTH}}
          minLength={PASSWORD_MIN_LENGTH}
          defaultValue={newPassword}
          onChange={handlePasswordChange}
        />

        <Input
          name="newConfirm"
          type="password"
          placeholderData={{length: PASSWORD_MIN_LENGTH}}
          minLength={PASSWORD_MIN_LENGTH}
          defaultValue={newConfirm}
          onChange={handleConfirmChange}
        />

        <ButtonToolbar>
          <Button
            bsStyle="primary"
            type="submit"
            disabled={!this.isValid()}
          >
            <FormattedMessage id="buttons.create"/>
          </Button>

          <div className="fancy">
            <FormattedMessage id="pages.createPassword.import"/>
          </div>

          <Button
            bsStyle="success"
            onClick={::this.onClick}
          >
            <FormattedMessage id="pages.createPassword.importSeedPhrase"/>
          </Button>
        </ButtonToolbar>
      </Form>
    );
  }
}
