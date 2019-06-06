import React, {Component} from "react";
import PropTypes from "prop-types";
import {ENVIRONMENT_TYPE_POPUP} from "../../../../../app/scripts/lib/enums";
import {getEnvironmentType} from "../../../../../app/scripts/lib/util";
import {DEFAULT_ROUTE, RESTORE_VAULT_ROUTE} from "../../../routes";
import {Button, ButtonToolbar, Form, Grid} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import Input from "../../input/input.group.validation";


export default class UnlockPage extends Component {

  static propTypes = {
    tryUnlockMetamask: PropTypes.func,
    markPasswordForgotten: PropTypes.func,
    history: PropTypes.object,
    isUnlocked: PropTypes.bool,
    addValidationMessage: PropTypes.func,
    onChange: PropTypes.func,
    handlePasswordChange: PropTypes.func,
    isValid: PropTypes.func,
    formData: PropTypes.shape({
      password: PropTypes.string,
    }),
  };

  componentWillMount () {
    const {isUnlocked, history} = this.props;

    if (isUnlocked) {
      history.push(DEFAULT_ROUTE);
    }
  }

  isValid () {
    const {isValid} = this.props;
    return isValid();
  }

  async onSubmit (e) {
    e.preventDefault();
    e.stopPropagation();

    const {
      formData: {password},
      tryUnlockMetamask,
      addValidationMessage,
      history,
    } = this.props;

    if (!this.isValid()) {
      return;
    }

    try {
      await tryUnlockMetamask(password);
      history.push(DEFAULT_ROUTE);
    } catch ({message}) {
      addValidationMessage({
        name: "password",
        reason: message,
      });
    }
  }

  onClick () {
    const {markPasswordForgotten, history} = this.props;

    markPasswordForgotten();
    history.push(RESTORE_VAULT_ROUTE);

    if (getEnvironmentType(window.location.href) === ENVIRONMENT_TYPE_POPUP) {
      global.platform.openExtensionInBrowser();
    }
  }

  render () {
    const {
      formData: {password},
      handlePasswordChange,
    } = this.props;

    return (
      <Grid className="page">
        <Form className="unlock-page" onSubmit={::this.onSubmit}>
          <h1 className="page__title">
            <FormattedMessage id="pages.unlockPage.title" />
          </h1>
          <Input
            name="password"
            type="password"
            defaultValue={password}
            onChange={handlePasswordChange}
          />
          <div className="unlock-page__links">
            <div
              className="unlock-page__link"
              onClick={::this.onClick}
            >
              <FormattedMessage id="pages.unlockPage.restoreFromSeed" />
            </div>
          </div>
          <ButtonToolbar>
            <Button
              type="submit"
              bsStyle="primary"
              disabled={!this.isValid()}
            >
              <FormattedMessage id="buttons.login" />
            </Button>
          </ButtonToolbar>
        </Form>
      </Grid>
    );
  }
}
