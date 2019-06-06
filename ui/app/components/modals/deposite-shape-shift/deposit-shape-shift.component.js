import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import ShapeshiftForm from "./shape-shift-form";
import {Modal} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import BackButton from "../back";


export default class DepositShapeShift extends Component {
  static propTypes = {
    openBuyEtherModal: PropTypes.func,
  };

  render () {
    const {openBuyEtherModal} = this.props;

    return (
      <Fragment>
        <Modal.Header closeButton={true}>
          <BackButton label="back" onClick={openBuyEtherModal}/>
          <Modal.Title id="contained-modal-title-lg">
            <FormattedMessage id="modals.depositeEther.title"/>
          </Modal.Title>
          <p><FormattedMessage id="modals.depositeEther.description"/></p>
        </Modal.Header>
        <Modal.Body>
          <div className={"deposit-ether-modal"}>
            <div className="deposit-ether-modal__buy-row">
              <div className="deposit-ether-modal__buy-row__logo-container">
                <img className="deposit-ether-modal__logo" src="/app/images/shapeshift logo.png"/>
              </div>
              <div className="deposit-ether-modal__buy-row__description">
                <div className="deposit-ether-modal__buy-row__description__title">
                  <FormattedMessage id="modals.depositeEther.depositShapeShift"/>
                </div>
                <div className="deposit-ether-modal__buy-row__description__text">
                  <FormattedMessage id="modals.depositeEther.depositShapeShiftExplainer"/>
                </div>
              </div>
            </div>
            <ShapeshiftForm/>
          </div>
        </Modal.Body>
      </Fragment>
    );
  }
}
