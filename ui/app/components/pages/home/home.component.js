import React, {Component} from "react";
import Balance from "./balance";
import Tabs from "./tabs";
import Receive from "./receive";
import {Grid} from "react-bootstrap";
import {
  CONFIRM_TRANSACTION_ROUTE,
  INITIALIZE_BACKUP_PHRASE_ROUTE,
  NOTICE_ROUTE,
  RESTORE_VAULT_ROUTE,
} from "../../../routes";
import PropTypes from "prop-types";


export default class Home extends Component {

  static propTypes = {
    history: PropTypes.object,
    noActiveNotices: PropTypes.bool,
    lostAccounts: PropTypes.array,
    forgottenPassword: PropTypes.bool,
    seedWords: PropTypes.string,
    unapprovedTxs: PropTypes.object,
    unapprovedMsgCount: PropTypes.number,
    unapprovedPersonalMsgCount: PropTypes.number,
    unapprovedTypedMessagesCount: PropTypes.number,
  };

  static defaultProps = {
    unapprovedTxs: {},
    unapprovedMsgCount: 0,
    unapprovedPersonalMsgCount: 0,
    unapprovedTypedMessagesCount: 0,
  };

  componentDidMount () {
    const {
      history,
      noActiveNotices,
      lostAccounts,
      forgottenPassword,
      seedWords,
      unapprovedTxs,
      unapprovedMsgCount,
      unapprovedPersonalMsgCount,
      unapprovedTypedMessagesCount,
    } = this.props;

    if (Object.keys(unapprovedTxs).length || unapprovedTypedMessagesCount + unapprovedMsgCount + unapprovedPersonalMsgCount > 0) {
      history.push(CONFIRM_TRANSACTION_ROUTE);
    }

    if (!noActiveNotices || (lostAccounts && lostAccounts.length > 0)) {
      history.push(NOTICE_ROUTE);
    }

    if (seedWords) {
      history.push(INITIALIZE_BACKUP_PHRASE_ROUTE);
    }

    if (forgottenPassword) {
      history.push(RESTORE_VAULT_ROUTE);
    }
  }

  render () {
    return (
      <Grid className="page">
        <Balance />
        <Receive />
        <Tabs />
      </Grid>
    );
  }
}
