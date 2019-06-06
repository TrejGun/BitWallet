import {connect} from "react-redux";
import Notice from "./notice.component";
import {markAccountsFound, markNoticeRead} from "../../../actions";
import generateLostAccountsNotice from "../../../../lib/lost-accounts-notice";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";


function mapStateToProps ({metamask}) {
  const {noActiveNotices, nextUnreadNotice, lostAccounts} = metamask;

  return {
    noActiveNotices,
    nextUnreadNotice,
    lostAccounts,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    markNoticeRead: nextUnreadNotice => dispatch(markNoticeRead(nextUnreadNotice)),
    markAccountsFound: () => dispatch(markAccountsFound()),
  };
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const {noActiveNotices, nextUnreadNotice, lostAccounts} = stateProps;
  const {markNoticeRead, markAccountsFound} = dispatchProps;

  let notice;
  let onConfirm;

  if (!noActiveNotices) {
    notice = nextUnreadNotice;
    onConfirm = () => markNoticeRead(nextUnreadNotice);
  } else if (lostAccounts && lostAccounts.length > 0) {
    notice = generateLostAccountsNotice(lostAccounts);
    onConfirm = () => markAccountsFound();
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    notice,
    onConfirm,
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
)(Notice);
