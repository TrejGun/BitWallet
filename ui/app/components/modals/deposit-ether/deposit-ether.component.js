import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import {getNetworkDisplayName} from "../../../../../app/scripts/controllers/network/util";
import {Button, Modal} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import {DETAIL_ACCOUNT_ROUTE} from "../../../routes";


export default class DepositEtherComponent extends Component {
  static propTypes = {
    history: PropTypes.object,
    network: PropTypes.string,
    toCoinbase: PropTypes.func,
    selectedAddress: PropTypes.string,
    toFaucet: PropTypes.func,
    hideWarning: PropTypes.func,
    hideModal: PropTypes.func,
    showAccountDetailModal: PropTypes.func,
    openBuyShapeShiftModal: PropTypes.func,
  };

  onHide () {
    const {hideWarning, hideModal} = this.props;
    hideWarning();
    hideModal();
  }

  isTestNetwork () {
    const {network} = this.props;
    return ["3", "4", "42"].find(n => n === network);
  }

  renderAccount () {
    const {
      history,
      selectedAddress,
    } = this.props;

    return (
      <div className="deposit-ether-modal__buy-row">
        <div className="deposit-ether-modal__buy-row__logo-container">
          <img className="deposit-ether-modal__logo" src="/app/images/deposit-eth.svg" />
        </div>
        <div className="deposit-ether-modal__buy-row__description">
          <div className="deposit-ether-modal__buy-row__description__title">
            <FormattedMessage id="modals.depositeEther.directDepositEther" />
          </div>
          <div className="deposit-ether-modal__buy-row__description__text">
            <FormattedMessage id="modals.depositeEther.directDepositEtherExplainer" />
          </div>
        </div>
        <Button
          bsStyle="primary"
          onClick={() => {
            this.onHide();
            history.push(DETAIL_ACCOUNT_ROUTE.replace(":address", selectedAddress));
          }}
        >
          <FormattedMessage id="modals.depositeEther.viewAccount" />
        </Button>
      </div>
    );
  }

  renderTestNetwork () {
    const {network, toFaucet} = this.props;
    const networkName = getNetworkDisplayName(network);

    if (!this.isTestNetwork()) {
      return null;
    }

    return (
      <div className="deposit-ether-modal__buy-row">
        <div className="deposit-ether-modal__buy-row__logo-container">
          <i className="fa fa-tint fa-2x" />
        </div>
        <div className="deposit-ether-modal__buy-row__description">
          <div className="deposit-ether-modal__buy-row__description__title">
            <FormattedMessage id="modals.depositeEther.testFaucet" />
          </div>
          <div className="deposit-ether-modal__buy-row__description__text">
            <FormattedMessage id="modals.depositeEther.getEtherFromFaucet" values={{name: networkName}} />
          </div>
        </div>
        <Button
          bsStyle="primary"
          onClick={() => toFaucet(network)}
        >
          <FormattedMessage id="modals.depositeEther.getEther" />
        </Button>
      </div>
    );
  }

  renderCoinbase () {
    const {toCoinbase, selectedAddress} = this.props;

    if (this.isTestNetwork()) {
      return null;
    }

    return (
      <div className="deposit-ether-modal__buy-row">
        <div className="deposit-ether-modal__buy-row__logo-container">
          <img className="deposit-ether-modal__logo" src="/app/images/coinbase logo.png" />
        </div>
        <div className="deposit-ether-modal__buy-row__description">
          <div className="deposit-ether-modal__buy-row__description__title">
            <FormattedMessage id="modals.depositeEther.buyCoinbase" />
          </div>
          <div className="deposit-ether-modal__buy-row__description__text">
            <FormattedMessage id="modals.depositeEther.buyCoinbaseExplainer" />
          </div>
        </div>
        <Button
          bsStyle="primary"
          onClick={() => toCoinbase(selectedAddress)}
        >
          <FormattedMessage id="modals.depositeEther.continueToCoinbase" />
        </Button>
      </div>
    );
  }

  renderShapeShift () {
    const {openBuyShapeShiftModal, selectedAddress} = this.props;

    if (this.isTestNetwork()) {
      return null;
    }

    return (
      <div className="deposit-ether-modal__buy-row">
        <div className="deposit-ether-modal__buy-row__logo-container">
          <img className="deposit-ether-modal__logo" src="/app/images/shapeshift logo.png" />
        </div>
        <div className="deposit-ether-modal__buy-row__description">
          <div className="deposit-ether-modal__buy-row__description__title">
            <FormattedMessage id="modals.depositeEther.depositShapeShift" />
          </div>
          <div className="deposit-ether-modal__buy-row__description__text">
            <FormattedMessage id="modals.depositeEther.depositShapeShiftExplainer" />
          </div>
        </div>
        <Button
          bsStyle="primary"
          onClick={() => {
            this.onHide();
            openBuyShapeShiftModal(selectedAddress);
          }}
        >
          <FormattedMessage id="modals.depositeEther.shapeshiftBuy" />
        </Button>
      </div>
    );
  }

  render () {
    return (
      <Fragment>
        <Modal.Header closeButton={true} onHide={::this.onHide}>
          <Modal.Title id="contained-modal-title-lg">
            <FormattedMessage id="modals.depositeEther.title" />
          </Modal.Title>
          <p><FormattedMessage id="modals.depositeEther.description" /></p>
        </Modal.Header>
        <Modal.Body>
          {this.renderAccount()}
          {this.renderTestNetwork()}
          {this.renderCoinbase()}
          {this.renderShapeShift()}
        </Modal.Body>
      </Fragment>
    );
  }
}
