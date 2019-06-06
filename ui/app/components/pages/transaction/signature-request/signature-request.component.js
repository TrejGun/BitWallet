import React, {Component} from "react";
import PropTypes from "prop-types";
import ethUtil from "ethereumjs-util";
import {DEFAULT_ROUTE} from "../../../../routes";
import {FormattedMessage, intlShape} from "react-intl";
import {Button, ButtonToolbar, Grid, Form} from "react-bootstrap";
import Markdown from "react-markdown";


export default class SignatureRequest extends Component {

  static propTypes = {
    txData: PropTypes.object,
    signPersonalMessage: PropTypes.func,
    signTypedMessage: PropTypes.func,
    cancelPersonalMessage: PropTypes.func,
    cancelTypedMessage: PropTypes.func,
    signMessage: PropTypes.func,
    cancelMessage: PropTypes.func,
    history: PropTypes.object,
    intl: intlShape,
  };

  msgHexToText (hex) {
    try {
      const stripped = ethUtil.stripHexPrefix(hex);
      return Buffer.from(stripped, "hex").toString("utf8");
    } catch (e) {
      return hex;
    }
  }

  renderBody () {
    const {intl} = this.props;
    let rows;

    const {txData} = this.props;
    const {type, msgParams: {data}} = txData;

    if (type === "personal_sign") {
      rows = [{name: intl.formatMessage({id: "pages.signatureRequest.message"}), value: this.msgHexToText(data)}];
    } else if (type === "eth_signTypedData") {
      rows = data;
    } else if (type === "eth_sign") {
      rows = [{name: intl.formatMessage({id: "pages.signatureRequest.message"}), value: data}];
    }

    return (
      <div className="request-signature__body">
        <div className="request-signature__rows">
          {rows.map(({name, value}, i) => {
            if (typeof value === "boolean") {
              value = value.toString();
            }
            return (
              <div className="request-signature__row" key={i}>
                <div className="request-signature__row-title">
                  {name}<FormattedMessage id="app.colon" />
                </div>
                <div className="request-signature__row-value">
                  <Markdown
                    className="markdown"
                    source={value}
                    skipHtml
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  renderFooter () {
    const {
      signPersonalMessage,
      signTypedMessage,
      cancelPersonalMessage,
      cancelTypedMessage,
      signMessage,
      cancelMessage,
      history,
    } = this.props;

    const {txData} = this.props;
    const {type} = txData;

    let cancel;
    let sign;
    if (type === "personal_sign") {
      cancel = cancelPersonalMessage;
      sign = signPersonalMessage;
    } else if (type === "eth_signTypedData") {
      cancel = cancelTypedMessage;
      sign = signTypedMessage;
    } else if (type === "eth_sign") {
      cancel = cancelMessage;
      sign = signMessage;
    }

    return (
      <ButtonToolbar>
        <Button
          bsStyle="default"
          onClick={event => {
            cancel(event).then(() => history.push(DEFAULT_ROUTE));
          }}
        >
          <FormattedMessage id="buttons.cancel" />
        </Button>
        <Button
          bsStyle="primary"
          onClick={event => {
            sign(event).then(() => history.push(DEFAULT_ROUTE));
          }}
        >
          <FormattedMessage id="buttons.sign" />
        </Button>
      </ButtonToolbar>
    );
  }

  render () {
    return (
      <Grid className="page request-signature">
        <Form>
          <div className="page__title">
            <FormattedMessage id="pages.signatureRequest.title" />
          </div>
          {this.renderBody()}
          {this.renderFooter()}
        </Form>
      </Grid>
    );
  }
}
