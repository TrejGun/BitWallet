import React, {Component} from "react";
import PropTypes from "prop-types";
import {exportAsFile} from "../../../../../util";
import {Button} from "react-bootstrap";
import {FormattedMessage, intlShape} from "react-intl";


export default class Logs extends Component {

  static propTypes = {
    displayWarning: PropTypes.func,
    intl: intlShape,
  };

  onClick (e) {
    e.preventDefault();
    const {displayWarning, intl} = this.props;
    window.logStateString((err, result) => {
      if (err) {
        displayWarning(intl.formatMessage({id: "pages.settings.tabs.settings.logs.error"}));
      } else {
        exportAsFile("MetaMaskStateLogs.json", result);
      }
    });
  }

  render () {
    return (
      <div className="settings__content-row">
        <div className="settings__content-item">
          <h4>
            <FormattedMessage id="pages.settings.tabs.settings.logs.title"/>
          </h4>
          <p className="settings__content-description">
            <FormattedMessage id="pages.settings.tabs.settings.logs.description"/>
          </p>
        </div>
        <Button onClick={::this.onClick}>
          <FormattedMessage id="pages.settings.tabs.settings.logs.button"/>
        </Button>
      </div>
    );
  }

}
