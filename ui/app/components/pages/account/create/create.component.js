import React, {Component} from "react";
import PropTypes from "prop-types";
import {DEFAULT_ROUTE} from "../../../../routes";
import {Button, ButtonToolbar, Form, Grid} from "react-bootstrap";
import {FormattedMessage, intlShape} from "react-intl";
import Input from "../../../input/input.group.validation";


export default class CreatePassword extends Component {

  static propTypes = {
    isLoading: PropTypes.bool,
    createAccount: PropTypes.func,
    history: PropTypes.object,
    formData: PropTypes.shape({
      accountName: PropTypes.string,
    }),
    onChange: PropTypes.func,
    intl: intlShape,
    identities: PropTypes.object,
    numberOfExistingAccounts: PropTypes.number,
  };

  static defaultProps = {
    identities: {}, // ??
  };

  onSubmit (e) {
    e.preventDefault();

    if (!this.isValid()) {
      return;
    }

    const {formData: {accountName}, createAccount, history} = this.props;

    createAccount(accountName)
      .then(() => history.push(DEFAULT_ROUTE));
  }

  isValid () {
    return true;
  }

  render () {
    const {
      formData: {accountName},
      identities,
      onChange,
      intl,
    } = this.props;

    return (
      <Grid className="page create-account">
        <div className="page__title">
          <FormattedMessage id="pages.account.create.title" />
        </div>
        <Form onSubmit={::this.onSubmit}>
          <Input
            defaultValue={accountName}
            placeholder={intl.formatMessage({
              id: `fields.accountName.placeholder`,
            }, {count: Object.keys(identities).length + 1})}
            name="accountName"
            onChange={onChange}
          />

          <ButtonToolbar>
            <Button
              bsStyle="primary"
              type="submit"
              disabled={!this.isValid()}
            >
              <FormattedMessage id="buttons.create" />
            </Button>
          </ButtonToolbar>
        </Form>
      </Grid>
    );
  }
}
