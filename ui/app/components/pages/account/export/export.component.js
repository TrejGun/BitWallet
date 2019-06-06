import React, {Component} from "react";
import {exportAsFile} from "../../../../util";
import {exportAccount} from "../../../../actions";
import ethUtil from "ethereumjs-util";
import PropTypes from "prop-types";
import Input from "../../../input/input.group";
import {Button, ButtonToolbar, Grid} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import {DETAIL_ACCOUNT_ROUTE} from "../../../../routes";
import CopyButton from "../../../buttons/copy";


export default class ExportAccount extends Component {

  static propTypes = {
    history: PropTypes.object,
    accountDetail: PropTypes.object,
    identities: PropTypes.object,
    dispatch: PropTypes.func,
    onChange: PropTypes.func,
    selectedAddress: PropTypes.string,
    formData: PropTypes.shape({
      password: PropTypes.string,
    }),
  };

  render () {
    const {
      formData: {
        password,
      },
      accountDetail,
      onChange,
    } = this.props;


    if (!accountDetail.privateKey) {
      // const warning = this.context.t("exportPrivateKeyWarning");
      return (
        <Grid>
          <h1 className="page__title">
            <FormattedMessage id="pages.account.export.title" />
          </h1>
          <Input
            type="password"
            name="password"
            onChange={onChange}
            defaultValue={password}
          />
          <ButtonToolbar>
            <Button
              bsStyle="default"
              onClick={::this.onExport}
            >
              <FormattedMessage id="buttons.submit" />
            </Button>
          </ButtonToolbar>
        </Grid>
      );
    } else {
      const plainKey = ethUtil.stripHexPrefix(accountDetail.privateKey);

      return (
        <Grid>
          <h1 className="page__title">
            <FormattedMessage id="pages.account.export.title" />
          </h1>
          <CopyButton selectedAddress={plainKey} />
          <ButtonToolbar>
            <Button
              bsStyle="default"
              onClick={::this.onSave}
            >
              <FormattedMessage id="buttons.save" />
            </Button>
          </ButtonToolbar>
        </Grid>
      );
    }
  }

  onExport (e) {
    e.preventDefault();

    const {
      dispatch,
      selectedAddress,
      formData: {
        password,
      },
    } = this.props;

    dispatch(exportAccount(password, selectedAddress));
  }

  onSave (e) {
    e.preventDefault();

    const {
      identities,
      selectedAddress,
      accountDetail,
    } = this.props;
    const plainKey = ethUtil.stripHexPrefix(accountDetail.privateKey);
    const nickname = identities[selectedAddress].name;

    exportAsFile(`MetaMask ${nickname} Private Key`, plainKey);
  }

  onCancel () {
    const {
      history,
      selectedAddress,
    } = this.props;
    history.push(DETAIL_ACCOUNT_ROUTE.replace(":address", selectedAddress));
  }
}

