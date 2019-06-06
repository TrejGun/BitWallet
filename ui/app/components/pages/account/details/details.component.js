import React, {Component} from "react";
import {Grid} from "react-bootstrap";
import EditableLabel from "../../../editable-label";
import Qr from "./qr";
import PropTypes from "prop-types";
import Identicon from "../../../identicon";


export default class AccountDetails extends Component {

  static propTypes = {
    selectedIdentity: PropTypes.object,
    network: PropTypes.string,
    showExportPrivateKeyModal: PropTypes.func,
    setAccountLabel: PropTypes.func,
    hideModal: PropTypes.func,
  };


  render () {
    const {
      selectedIdentity,
      setAccountLabel,
    } = this.props;
    const {name, address} = selectedIdentity;

    return (
      <Grid className="page blue account-details">
        <Identicon address={address} diameter={42}/>
        <EditableLabel
          defaultValue={name}
          onSubmit={label => setAccountLabel(address, label)}
        />
        <Qr address={address}/>
      </Grid>
    );
  }
}
