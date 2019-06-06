import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import {Modal, Button, ButtonToolbar} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


export default class ConfirmResetAccount extends Component {
  static propTypes = {
    hideModal: PropTypes.func.isRequired,
    resetAccount: PropTypes.func.isRequired,
  };

  handleReset () {
    const {resetAccount, hideModal} = this.props;
    resetAccount()
      .then(() => hideModal());
  }

  render () {
    const {hideModal} = this.props;

    return (
      <Fragment>
        <Modal.Header closeButton={true} onHide={hideModal}>
          <Modal.Title id="contained-modal-title-lg">
            <FormattedMessage id="modals.resetAccount.title"/>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormattedMessage id="modals.resetAccount.description"/>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button
              bsStyle="default"
              onClick={hideModal}
            >
              <FormattedMessage id="buttons.nevermind"/>
            </Button>
            <Button
              bsStyle="primary"
              onClick={::this.handleReset}
            >
              <FormattedMessage id="buttons.reset"/>
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Fragment>
    );
  }
}
