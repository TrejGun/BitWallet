import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import {Button, ButtonToolbar, Modal} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


export default class Notification extends Component {
  static propTypes = {
    hideModal: PropTypes.func,
  };

  render () {
    const {hideModal} = this.props;
    return (
      <Fragment>
        <Modal.Header closeButton={true} onHide={hideModal}>
          <Modal.Title>
            <FormattedMessage id="modals.notification.confirmed"/>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src="/app/images/check-icon.svg"/>
          <FormattedMessage id="modals.notification.description"/>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button
              bsStyle="primary"
              onClick={hideModal}
            >
              <FormattedMessage id="buttons.nevermind"/>
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Fragment>
    );
  }
}
