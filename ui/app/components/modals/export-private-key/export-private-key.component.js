import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import {stripHexPrefix} from "ethereumjs-util";
import copyToClipboard from "copy-to-clipboard";
import {checksumAddress} from "../../../util";
import Input from "../../input/input.group.validation";
import {FormattedMessage} from "react-intl";
import {Button, ButtonToolbar, Alert, Modal} from "react-bootstrap";
import Identicon from "../../identicon";
import BackButton from "../back";


export default class ExportPrivateKey extends Component {

  static propTypes = {
    exportAccount: PropTypes.func,
    selectedIdentity: PropTypes.object,
    warning: PropTypes.string,
    showAccountDetailModal: PropTypes.func,
    hideModal: PropTypes.func,
    previousModalState: PropTypes.string,
    addValidationMessage: PropTypes.func,
    handlePasswordChange: PropTypes.func,
    isValid: PropTypes.func,
    formData: PropTypes.shape({
      password: PropTypes.string,
    }),
  };

  state = {
    privateKey: null,
  };

  isValid () {
    const {isValid} = this.props;
    return isValid();
  }

  exportAccountAndGetPrivateKey () {
    const {
      formData: {password},
      selectedIdentity: {address},
      exportAccount,
      addValidationMessage,
    } = this.props;

    exportAccount(password, address)
      .then(privateKey => this.setState({privateKey}))
      .catch(e => {
        addValidationMessage({
          name: "password",
          reason: e.message,
        });
      });
  }

  renderPrivateKey () {
    const {privateKey} = this.state;
    const plainKey = privateKey && stripHexPrefix(privateKey);

    if (privateKey) {
      return (
        <Input
          name="password"
          type="password"
          value={plainKey}
          onClick={() => copyToClipboard(plainKey)}
        />
      );
    } else {
      return null;
    }
  }

  renderBackButton () {
    const {
      showAccountDetailModal,
      previousModalState,
    } = this.props;

    if (previousModalState === "ACCOUNT_DETAILS") {
      return (
        <BackButton label="back" onClick={showAccountDetailModal}/>
      );
    } else {
      return null;
    }
  }

  render () {
    const {
      formData: {password},
      selectedIdentity: {name, address},
      hideModal,
      selectedIdentity,
      handlePasswordChange,
    } = this.props;

    return (
      <Fragment>
        <Modal.Header closeButton={true} onHide={hideModal}>
          {this.renderBackButton()}
          <Modal.Title id="contained-modal-title-lg">
            <Identicon
              address={selectedIdentity.address}
              diameter={64}
            />
            {name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input
            name="address"
            value={checksumAddress(address)}
            readOnly
          />
          <Input
            name="password"
            type="password"
            defaultValue={password}
            onChange={handlePasswordChange}
          />
          <Alert bsStyle="danger">
            <FormattedMessage id="modals.account.privateKeyWarning"/>
          </Alert>
          {this.renderPrivateKey()}
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button
              bsStyle="default"
              className="export-private-key__button export-private-key__button--cancel"
              onClick={hideModal}
            >
              <FormattedMessage id="buttons.cancel"/>
            </Button>
            <Button
              bsStyle="primary"
              className="export-private-key__button"
              onClick={::this.exportAccountAndGetPrivateKey}
              disabled={!this.isValid()}
            >
              <FormattedMessage id="buttons.confirm"/>
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Fragment>
    );
  }
}
