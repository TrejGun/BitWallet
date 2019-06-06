import React, {Component} from "react";
import PropTypes from "prop-types";
import {DEFAULT_ROUTE} from "../../../../routes";
import {FormattedMessage, intlShape} from "react-intl";
import {Alert, Button, ButtonToolbar, Form, Grid, Image} from "react-bootstrap";
import Input from "../../../input/input.group.validation";
import Copyable from "../../../copy/copyable";

const PASSWORD_PROMPT_SCREEN = "PASSWORD_PROMPT_SCREEN";
const REVEAL_SEED_SCREEN = "REVEAL_SEED_SCREEN";


export default class RevealSeed extends Component {

  static propTypes = {
    requestRevealSeedWords: PropTypes.func,
    history: PropTypes.object,
    addValidationMessage: PropTypes.func,
    onChange: PropTypes.func,
    formData: PropTypes.shape({
      password: PropTypes.string,
    }),
    intl: intlShape,
  };

  state = {
    screen: PASSWORD_PROMPT_SCREEN,
    seedWords: "null",
  };

  onSubmit (e) {
    e.preventDefault();
    const {
      addValidationMessage,
      requestRevealSeedWords,
      formData: {password},
    } = this.props;
    this.setState({seedWords: null});
    requestRevealSeedWords(password)
      .then(seedWords => {
        this.setState({
          seedWords,
          screen: REVEAL_SEED_SCREEN,
        });
      })
      .catch(e => {
        addValidationMessage({
          name: "password",
          reason: e.message,
        });
      });
  }

  renderWarning () {
    return (
      <Alert bsStyle="danger">
        <Image className="page-container__warning-icon" src="/app/images/warning.svg" />
        <FormattedMessage id="pages.revealSeed.revealSeedWordsWarningTitle" />
        <FormattedMessage id="pages.revealSeed.revealSeedWordsWarning" />
      </Alert>
    );
  }

  renderContent () {
    return this.state.screen === PASSWORD_PROMPT_SCREEN
      ? this.renderPasswordPromptContent()
      : this.renderRevealSeedContent();
  }

  renderPasswordPromptContent () {
    const {
      onChange,
      formData: {password},
    } = this.props;
    return (
      <Form onSubmit={::this.onSubmit}>
        <Input
          type="password"
          name="password"
          onChange={onChange}
          defaultValue={password}
        />
      </Form>
    );
  }

  renderRevealSeedContent () {
    const {seedWords} = this.state;
    return (
      <Copyable value={seedWords}>
        <div className="reveal-seed__secret">
          <div className="reveal-seed__secret-words">
            {seedWords}
          </div>
        </div>
      </Copyable>
    );
  }

  renderFooter () {
    return this.state.screen === PASSWORD_PROMPT_SCREEN
      ? this.renderPasswordPromptFooter()
      : this.renderRevealSeedFooter();
  }

  onCancel () {
    const {history} = this.props;
    history.push(DEFAULT_ROUTE);
  }

  renderPasswordPromptFooter () {
    return (
      <ButtonToolbar>
        <Button
          bsStyle="default"
          onClick={::this.onCancel}
        >
          <FormattedMessage id="buttons.cancel" />
        </Button>
        <Button
          bsStyle="primary"
          onClick={::this.onSubmit}
          disabled={this.state.password === ""}
        >
          <FormattedMessage id="buttons.next" />
        </Button>
      </ButtonToolbar>
    );
  }

  renderRevealSeedFooter () {
    return (
      <ButtonToolbar>
        <Button
          bsStyle="default"
          onClick={::this.onCancel}
        >
          <FormattedMessage id="buttons.close" />
        </Button>
      </ButtonToolbar>
    );
  }

  render () {
    return (
      <Grid className="page reveal-seed">
        <div className="page__title">
          <FormattedMessage id="pages.revealSeed.title" />
        </div>
        <div className="page__subtitle">
          <FormattedMessage id="pages.revealSeed.description" />
        </div>

        {this.renderWarning()}
        {this.renderContent()}
        {this.renderFooter()}
      </Grid>
    );
  }
}
