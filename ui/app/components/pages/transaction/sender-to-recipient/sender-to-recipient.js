import React, {Component} from "react";
import PropTypes from "prop-types";
import Identicon from "../../../identicon/index";
import {FormattedMessage} from "react-intl";
import Copyable from "../../../copy/copyable";


export default class SenderToRecipient extends Component {

  static propTypes = {
    senderName: PropTypes.string,
    senderAddress: PropTypes.string,
    recipientName: PropTypes.string,
    recipientAddress: PropTypes.string,
  };

  renderIcon (address) {
    if (address) {
      return (
        <Identicon
          address={address}
          diameter={20}
        />
      );
    } else { // deploy contract
      return (
        <i className="fa fa-file-text-o" />
      );
    }
  }

  renderRecipient () {
    const {recipientAddress, recipientName} = this.props;
    return (
      <div className="sender-to-recipient__recipient">
        <div className="label">
          <FormattedMessage id="pages.transaction.sender" />
        </div>
        <Copyable value={recipientAddress}>
          <div className="name">
            {this.renderIcon(recipientAddress)}
            <div className="sender-to-recipient__name sender-to-recipient__recipient-name">
              {recipientName || <FormattedMessage id="pages.transaction.newContract" />}
            </div>
          </div>
        </Copyable>
      </div>
    );
  }

  renderSender () {
    const {senderAddress, senderName} = this.props;
    return (
      <div className="sender-to-recipient__sender">
        <div className="label">
          <FormattedMessage id="pages.transaction.recipient" />
        </div>
        <Copyable value={senderAddress}>
          <div className="name">
            {this.renderIcon(senderAddress)}
            <div className="sender-to-recipient__name sender-to-recipient__sender-name">
              {senderName}
            </div>
          </div>
        </Copyable>
      </div>
    );
  }

  render () {
    return (
      <div className="sender-to-recipient__container">
        {this.renderSender()}
        <div className="sender-to-recipient__arrow-container">
          <div className="sender-to-recipient__arrow-circle">
            <img src="/app/images/arrow-right.svg" />
          </div>
        </div>
        {this.renderRecipient()}
      </div>
    );
  }
}
