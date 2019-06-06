import React, {Component} from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import {DEFAULT_ROUTE, INITIALIZE_CONFIRM_SEED_ROUTE} from "../../../../../ui/app/routes";
import LockIcon from "./lock-icon";
import {Button, ButtonToolbar} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


export default class BackupPhrase extends Component {
  static propTypes = {
    seedWords: PropTypes.string,
    history: PropTypes.object,
  };

  static defaultProps = {
    seedWords: "",
  };

  state = {
    isShowingSecret: false,
  };

  componentWillMount () {
    const {seedWords, history} = this.props;

    if (!seedWords) {
      history.push(DEFAULT_ROUTE);
    }
  }

  renderSecretWordsContainer () {
    const {isShowingSecret} = this.state;
    const {seedWords} = this.props;

    return (
      <div className="backup-phrase__secret">
        <div className={classnames("backup-phrase__secret-words", {
          "backup-phrase__secret-words--hidden": !isShowingSecret,
        })}>
          {seedWords}
        </div>
        {this.renderBlocker()}
      </div>
    );
  }

  renderBlocker () {
    const {isShowingSecret} = this.state;

    if (isShowingSecret) {
      return null;
    }

    return (
      <div className="backup-phrase__secret-blocker" onClick={::this.onClickUnblock}>
        <LockIcon width="28px" height="35px" fill="#FFFFFF"/>
        <div className="backup-phrase__reveal-button">
          <FormattedMessage id="pages.backupPhrase.blocker"/>
        </div>
      </div>
    );
  }

  onClickUnblock () {
    this.setState({isShowingSecret: true});
  }

  onClickNext () {
    const {history} = this.props;
    history.push(INITIALIZE_CONFIRM_SEED_ROUTE);
  }

  render () {
    const {isShowingSecret} = this.state;

    return (
      <div className="backup-phrase">
        <div className="first-time-flow__title">
          <FormattedMessage id="pages.backupPhrase.title"/>
        </div>
        {this.renderSecretWordsContainer()}
        <div className="first-time-flow__description">
          <FormattedMessage id="pages.backupPhrase.p1"/>
        </div>
        <div className="first-time-flow__description">
          <FormattedMessage id="pages.backupPhrase.p2"/>
        </div>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            onClick={::this.onClickNext}
            disabled={!isShowingSecret}
          >
            <FormattedMessage id="buttons.next"/>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}
