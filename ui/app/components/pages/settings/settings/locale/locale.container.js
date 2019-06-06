import {compose} from "recompose";
import {connect} from "react-redux";
import {updateCurrentLocale} from "../../../../../actions";
import Settings from "./locale.component";
import {injectIntl} from "react-intl";


function mapStateToProps ({metamask}) {
  return {
    currentLocale: metamask.currentLocale,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    updateCurrentLocale: key => dispatch(updateCurrentLocale(key)),
  };
}

export default compose(
  injectIntl,
  connect(mapStateToProps, mapDispatchToProps),
)(Settings);
