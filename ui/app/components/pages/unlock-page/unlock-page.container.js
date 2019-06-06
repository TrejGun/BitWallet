import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {
  tryUnlockMetamask,
  forgotPassword,
  markPasswordForgotten,
} from "../../../actions";
import UnlockPage from "./unlock-page.component";
import withLoader from "../../form/withLoader";
import withForm from "../../form/withForm";
import withPassword from "../../form/withPassword";
import withValidation from "../../form/withValidation";


function mapStateToProps (state) {
  const {metamask: {isUnlocked}} = state;
  return {
    isUnlocked,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    forgotPassword: () => dispatch(forgotPassword()),
    tryUnlockMetamask: password => dispatch(tryUnlockMetamask(password)),
    markPasswordForgotten: () => dispatch(markPasswordForgotten()),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withLoader(),
  withForm,
  withValidation,
  withPassword,
)(UnlockPage);
