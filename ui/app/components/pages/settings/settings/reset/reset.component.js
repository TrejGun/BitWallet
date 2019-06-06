import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


export default class Reset extends Component {

  static propTypes = {
    showResetAccountConfirmationModal: PropTypes.func,
  };

  onClick (e) {
    e.preventDefault();
    const {showResetAccountConfirmationModal} = this.props;
    showResetAccountConfirmationModal();
  }

  render () {
    return (
      <div className="settings__content-row">
        <div className="settings__content-item">
          <h4>
            <FormattedMessage id="pages.settings.tabs.settings.reset.title"/>
          </h4>
        </div>
        <Button onClick={::this.onClick}>
          <FormattedMessage id="pages.settings.tabs.settings.reset.button"/>
        </Button>
      </div>
    );
  }

}
