import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import Identicon from "../../identicon/index";
import {Modal, Button, ButtonToolbar} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


export default class HideTokenConfirmationComponent extends Component {

  static propTypes = {
    token: PropTypes.object,
    hideToken: PropTypes.func,
    hideModal: PropTypes.func,
  };

  state = {}

  render () {
    const {token, hideToken, hideModal} = this.props;
    const {symbol, address} = token;

    return (
      <Fragment>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-lg">
            <Identicon
              address={address}
              diameter={64}
            />
            <FormattedMessage id="modals.hideToken.hideTokenPrompt"/>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="hide-token-confirmation__symbol">{symbol}</div>
          <div className="hide-token-confirmation__copy">
            <FormattedMessage id="modals.hideToken.readdToken"/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button
              bsStyle="primary"
              onClick={hideModal}
            >
              <FormattedMessage id="buttons.cancel"/>
            </Button>
            <Button
              bsStyle="primary"
              onClick={() => hideToken(address)}
            >
              <FormattedMessage id="buttons.hide"/>
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Fragment>
    );
  }
}
