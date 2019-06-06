import React, {Component} from "react";
import PropTypes from "prop-types";
import {REVEAL_SEED_ROUTE} from "../../../../../routes";
import {Button} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


export default class Seed extends Component {

  static propTypes = {
    history: PropTypes.object,
  };

  onClick (e) {
    e.preventDefault();
    const {history} = this.props;
    history.push(REVEAL_SEED_ROUTE);
  }

  render () {
    return (
      <div className="settings__content-row">
        <div className="settings__content-item">
          <h4>
            <FormattedMessage id="pages.settings.tabs.settings.seed.title"/>
          </h4>
        </div>
        <Button onClick={::this.onClick}>
          <FormattedMessage id="pages.settings.tabs.settings.seed.button"/>
        </Button>
      </div>
    );
  }
}
