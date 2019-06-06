import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import {markNoticeRead} from "../../../../../ui/app/actions";
import Notice from "./notice.component";
import withLoader from "../../../../../ui/app/components/form/withLoader";


function mapStateToProps ({metamask}) {
  const {nextUnreadNotice, noActiveNotices} = metamask;

  return {
    nextUnreadNotice,
    noActiveNotices,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    markNoticeRead: notice => dispatch(markNoticeRead(notice)),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withLoader("account")
)(Notice);
