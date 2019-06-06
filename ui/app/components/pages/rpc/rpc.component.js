import React, {Component} from "react";
import PropTypes from "prop-types";
import validUrl from "valid-url";
import {Button, ButtonToolbar, Form, Grid} from "react-bootstrap";
import {FormattedMessage, intlShape} from "react-intl";
import Input from "../../input/input.group.validation";


export default class Rpc extends Component {

  static propTypes = {
    setRpcTarget: PropTypes.func,
    intl: intlShape,
    onChange: PropTypes.func,
    formData: PropTypes.shape({
      rpcurl: PropTypes.string,
    }),
    delValidationMessage: PropTypes.func,
    addValidationMessage: PropTypes.func,
    isValid: PropTypes.func,
  };

  isValid () {
    const {formData: {rpcurl}, isValid} = this.props;

    if (!rpcurl) {
      return false;
    }

    return isValid();
  }

  onRpcUrlChange (e) {
    const rpcurl = e.target.value;
    const {addValidationMessage, onChange} = this.props;

    if (!validUrl.isWebUri(rpcurl)) {
      const appendedRpc = `http://${rpcurl}`;

      if (validUrl.isWebUri(appendedRpc)) {
        addValidationMessage({
          name: "rpcurl",
          reason: "prefix",
        });
      } else {
        addValidationMessage({
          name: "rpcurl",
          reason: "invalid",
        });
      }
    }

    onChange(e);
  }

  onSubmit (e) {
    e.preventDefault();
    const {formData: {rpcurl}, setRpcTarget} = this.props;

    if (!this.isValid()) {
      return;
    }

    setRpcTarget(rpcurl);
  }

  render () {
    const {formData: {rpcurl}} = this.props;

    return (
      <Grid className="page rpc">
        <div className="page__title">
          <FormattedMessage id="pages.rpc.title" />
        </div>
        <Form onSubmit={::this.onSubmit}>
          <Input
            name="rpcurl"
            onChange={::this.onRpcUrlChange}
            defaultValue={rpcurl}
          />
          <ButtonToolbar>
            <Button
              type="submit"
              bsStyle="primary"
              disabled={!this.isValid()}
            >
              <FormattedMessage id="buttons.save" />
            </Button>
          </ButtonToolbar>
        </Form>
      </Grid>
    );
  }
}
