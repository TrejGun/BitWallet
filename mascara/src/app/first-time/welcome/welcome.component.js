import React, {Component} from "react";
import PropTypes from "prop-types";
import {INITIALIZE_CREATE_PASSWORD_ROUTE} from "../../../../../ui/app/routes";
import {Button, ButtonToolbar, Image} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import json from "../../../../../package";
import lang from "../../../../../ui/app/localization/en";


export default class Welcome extends Component {

  static propTypes = {
    closeWelcomeScreen: PropTypes.func,
    welcomeScreenSeen: PropTypes.bool,
    history: PropTypes.object,
  };

  componentWillMount () {
    const {history, welcomeScreenSeen} = this.props;

    if (welcomeScreenSeen) {
      history.push(INITIALIZE_CREATE_PASSWORD_ROUTE);
    }
  }

  onClickNext () {
    const {closeWelcomeScreen, history} = this.props;
    closeWelcomeScreen();
    history.push(INITIALIZE_CREATE_PASSWORD_ROUTE);
  }

  render () {
    return (
      <div className="welcome-screen">
        <div className="first-time-flow__title">
          <FormattedMessage id="pages.welcome.title" values={{name: lang.app.name, version: json.version}}/>
        </div>
        <Image src="/app/images/first-time/Wallet_illustration_main.png"/>
        <div className="first-time-flow__description">
          <FormattedMessage id="pages.welcome.description" values={{name: lang.app.name}}/>
        </div>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            onClick={::this.onClickNext}
          >
            <FormattedMessage id="buttons.continue"/>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}
