import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {addNewAccount, setAccountLabel} from "../../../../actions";
import CreatePassword from "./create.component";
import {injectIntl} from "react-intl";
import withLoader from "../../../form/withLoader";
import withForm from "../../../form/withForm";


function mapStateToProps ({metamask}) {
  const {identities} = metamask;

  return {
    identities,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    createAccount: newAccountName =>
      dispatch(addNewAccount())
        .then(newAccountAddress => {
          if (newAccountName) {
            dispatch(setAccountLabel(newAccountAddress, newAccountName));
          }
        }),
  };
}

export default compose(
  injectIntl,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withLoader("account"),
  withForm,
)(CreatePassword);
