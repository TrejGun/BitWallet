import React, {Component} from "react";
import PropTypes from "prop-types";
import {DEFAULT_ROUTE} from "../../../../routes";
import log from "loglevel";
import {Button, ButtonToolbar, Form, Grid} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import {PASSWORD_MIN_LENGTH} from "../../../../../../ui/app/components/form/withNewPassword";
import Input from "../../../input/input.group.validation";


export default class RestoreVault extends Component {

  static propTypes = {
    createNewVaultAndRestore: PropTypes.func.isRequired,
    unMarkPasswordForgotten: PropTypes.func.isRequired,
    history: PropTypes.object,
    isLoading: PropTypes.bool,
    formData: PropTypes.shape({
      newPassword: PropTypes.string,
      newConfirm: PropTypes.string,
      seed: PropTypes.string,
    }),
    addValidationMessage: PropTypes.func,
    handlePasswordChange: PropTypes.func,
    handleConfirmChange: PropTypes.func,
    handleSeedChange: PropTypes.func,
    isValid: PropTypes.func,
  };

  cancel () {
    const {
      unMarkPasswordForgotten,
      history,
    } = this.props;

    unMarkPasswordForgotten()
      .then(() =>
        history.push(DEFAULT_ROUTE),
      );
  }

  onSubmit (e) {
    e.preventDefault();

    if (!this.isValid()) {
      return;
    }

    const {
      formData: {newPassword, seed},
      createNewVaultAndRestore,
      unMarkPasswordForgotten,
      history,
    } = this.props;

    unMarkPasswordForgotten();
    createNewVaultAndRestore(newPassword, seed)
      .then(() => history.push(DEFAULT_ROUTE))
      .catch(({message}) => {
        log.error(message);
      });
  }

  isValid () {
    const {isValid} = this.props;
    return isValid();
  }

  render () {
    const {
      formData: {newPassword, newConfirm, seed},
      handlePasswordChange,
      handleConfirmChange,
      handleSeedChange,
    } = this.props;

    return (
      <Grid className="page">
        <Form className="restore-vault" onSubmit={::this.onSubmit}>
          <div className="first-time-flow__title">
            <FormattedMessage id="pages.restoreVault.title" />
          </div>

          <Input
            name="seed"
            componentClass="textarea"
            defaultValue={seed}
            onChange={handleSeedChange}
          />

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
              <FormattedMessage id="buttons.ok" />
            </Button>
          </ButtonToolbar>
        </Form>
      </Grid>
    );
  }
}
