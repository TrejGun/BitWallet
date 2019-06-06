import React, {Component} from "react";
import PropTypes from "prop-types";
import Loading from "../../../../loading-screen";
import {Button, ButtonToolbar, Form} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import Input from "../../../../input/input.group.validation";
import {INITIALIZE_NOTICE_ROUTE} from "../../../../../routes";


export default class ImportPrivateKey extends Component {

  static propTypes = {
    history: PropTypes.object,
    importNewAccount: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    addValidationMessage: PropTypes.func,
    formData: PropTypes.shape({
      privateKey: PropTypes.string,
    }),
    validations: PropTypes.array,
  };

  isValid () {
    const {formData: {privateKey}, validations} = this.props;

    if (!privateKey) {
      return false;
    }

    return !validations.length;
  }

  onSubmit () {
    const {formData: {privateKey}, importNewAccount, addValidationMessage, history} = this.props;
    return importNewAccount("Private Key", [privateKey])
      .then(() => history.push(INITIALIZE_NOTICE_ROUTE))
      .catch(e => {
        addValidationMessage({
          name: "privateKey",
          reason: e instanceof Error ? e.message : e,
        });
      });
  }

  render () {
    const {formData: {privateKey}, isLoading, onChange} = this.props;

    if (isLoading) {
      return (
        <Loading loadingMessage="account"/>
      );
    }

    return (
      <Form className="import-private-key" onSubmit={::this.onSubmit}>
        <Input
          defaultValue={privateKey}
          name="privateKey"
          onChange={onChange}
        />

        <ButtonToolbar>
          <Button
            bsStyle="primary"
            type="submit"
            disabled={!this.isValid()}
          >
            <FormattedMessage id="buttons.import"/>
          </Button>
        </ButtonToolbar>
      </Form>
    );
  }
}
