import React, {Component} from "react";
import PropTypes from "prop-types";
import {INITIALIZE_NOTICE_ROUTE, INITIALIZE_CREATE_PASSWORD_ROUTE} from "../../../../../ui/app/routes";
import {Button, ButtonToolbar, Form, Image} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import log from "loglevel";
import {PASSWORD_MIN_LENGTH} from "../../../../../ui/app/components/form/withNewPassword";
import Input from "../../../../../ui/app/components/input/input.group.validation";
import BackButton from "../../../../../ui/app/components/buttons/back";


export default class ImportSeedPhrase extends Component {

  static propTypes = {
    createNewVaultAndRestore: PropTypes.func.isRequired,
    unMarkPasswordForgotten: PropTypes.func,
    history: PropTypes.object,
    formData: PropTypes.shape({
      newPassword: PropTypes.string,
      newConfirm: PropTypes.string,
      seed: PropTypes.string,
    }),
    handlePasswordChange: PropTypes.func,
    handleConfirmChange: PropTypes.func,
    handleSeedChange: PropTypes.func,
    isValid: PropTypes.func,
    onChange: PropTypes.func,
  };

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
      .then(() => history.push(INITIALIZE_NOTICE_ROUTE))
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
      history,
    } = this.props;

    return (
      <Form className="import-seed-phrase" onSubmit={::this.onSubmit}>
        <div className="first-time-flow__title">
          <BackButton
            text="back"
            onClick={() => history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)}
          />
          <FormattedMessage id="pages.importSeedPhrase.title" />
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

        <Image src="/app/images/first-time/Wallet_illustration_2.png" />

        <ButtonToolbar>
          <Button
            bsStyle="primary"
            type="submit"
            disabled={!this.isValid()}
          >
            <FormattedMessage id="buttons.import" />
          </Button>
        </ButtonToolbar>
      </Form>
    );
  }
}
