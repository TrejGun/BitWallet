import {connect} from "react-redux";
import Search from "./search.component";
import {addTokens} from "../../../../actions";
import {compose} from "recompose";
import {injectIntl} from "react-intl";
import {withRouter} from "react-router-dom";
import withForm from "../../../form/withForm";


function mapStateToProps ({metamask}) {
  const {tokens} = metamask;
  return {
    tokens,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    addTokens: tokens => dispatch(addTokens(tokens)),
  };
}

export default compose(
  withRouter,
  injectIntl,
  connect(mapStateToProps, mapDispatchToProps),
  withForm
)(Search);
