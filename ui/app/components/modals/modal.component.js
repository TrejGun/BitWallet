import React, {Component} from "react";
import PropTypes from "prop-types";
import {Modal} from "react-bootstrap";


// Modal Components
import DepositEtherModal from "./deposit-ether";
import DepositShapeShiftModal from "./deposite-shape-shift";
import ExportPrivateKeyModal from "./export-private-key";
import HideTokenConfirmationModal from "./hide-token-confirmation";
import ConfirmResetAccount from "./confirm-reset-account";
import Notification from "./notification";
import CustomizeGas from "./customize-gas";


const MODALS = {
  DEPOSIT_ETHER: <DepositEtherModal />,
  DEPOSIT_SHAPE_SHIFT: <DepositShapeShiftModal />,
  EXPORT_PRIVATE_KEY: <ExportPrivateKeyModal />,
  HIDE_TOKEN_CONFIRMATION: <HideTokenConfirmationModal />,
  CONFIRM_RESET_ACCOUNT: <ConfirmResetAccount />,
  TRANSACTION_CONFIRMED: <Notification />,
  CUSTOMIZE_GAS: <CustomizeGas />,
  DEFAULT: null,
};

export default class MetaMaskModal extends Component {

  static propTypes = {
    modalState: PropTypes.object,
    active: PropTypes.bool,
    onHideCallback: PropTypes.func,
    hideModal: PropTypes.func,
  };

  render () {
    const {modalState, active, hideModal} = this.props;
    const modal = modalState.name in MODALS ? MODALS[modalState.name] : MODALS["DEFAULT"];

    return (
      <Modal
        show={active}
        onHide={hideModal}
      >
        {modal}
      </Modal>
    );
  }

}
