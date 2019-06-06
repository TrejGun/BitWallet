import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import BackupPhrase from "./backup-seed.component";
import withLoader from "../../../../../ui/app/components/form/withLoader";


function mapStateToProps ({metamask}) {
  const {seedWords} = metamask;

  return {
    seedWords,
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps),
  withLoader("account"),
)(BackupPhrase);
