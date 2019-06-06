import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import Home from "./home.component";


function mapStateToProps ({appState, metamask}) {
  const {
    noActiveNotices,
    unapprovedTxs,
    nextUnreadNotice,
    lostAccounts,
    unapprovedMsgCount,
    unapprovedPersonalMsgCount,
    unapprovedTypedMessagesCount,
    seedWords,
    unapprovedMsgs,
  } = metamask;

  const {
    forgottenPassword,
  } = appState;

  return {
    noActiveNotices,
    seedWords,
    unapprovedTxs,
    unapprovedMsgs,
    unapprovedMsgCount,
    unapprovedPersonalMsgCount,
    unapprovedTypedMessagesCount,
    forgottenPassword,
    nextUnreadNotice,
    lostAccounts,
  };
}

function mapDispatchToProps () {
  return {};
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Home);
