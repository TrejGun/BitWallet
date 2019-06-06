import {connect} from "react-redux";
import RevealSeed from "./reveal-seed.component";
import {requestRevealSeedWords} from "../../../../actions";
import {compose} from "recompose";
import withForm from "../../../form/withForm";
import withPassword from "../../../form/withPassword";
import {withRouter} from "react-router-dom";
import {injectIntl} from "react-intl";
import withValidation from "../../../form/withValidation";


function mapDispatchToProps (dispatch) {
  return {
    requestRevealSeedWords: password => dispatch(requestRevealSeedWords(password)),
  };
}

export default compose(
  injectIntl,
  withRouter,
  connect(null, mapDispatchToProps),
  withForm,
  withValidation,
  withPassword,
)(RevealSeed);
