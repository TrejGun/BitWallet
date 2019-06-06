import {connect} from "react-redux";
import AddToken from "./add-token.component";
import {compose} from "recompose";
import {injectIntl} from "react-intl";
import {withRouter} from "react-router-dom";


function mapStateToProps ({metamask}) {
  const {provider} = metamask;
  return {
    provider,
  };
}

export default compose(
  withRouter,
  injectIntl,
  connect(mapStateToProps),
)(AddToken);
