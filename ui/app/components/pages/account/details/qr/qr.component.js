import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import {qrcode} from "qrcode-npm";
import {isHexPrefixed} from "ethereumjs-util";
import CopyButton from "../../../../buttons/copy";


export default class QrCode extends Component {

  static propTypes = {
    address: PropTypes.string,
  };

  render () {
    const {address} = this.props;
    const data = `${isHexPrefixed(address) ? "ethereum:" : ""}${address}`;
    const qrImage = qrcode(4, "M");
    qrImage.addData(data);
    qrImage.make();

    return (
      <Fragment>
        <div className="qr-wrapper" dangerouslySetInnerHTML={{__html: qrImage.createTableTag(4, "0 auto;")}} />
        <CopyButton selectedAddress={address}/>
      </Fragment>
    );
  }
}
