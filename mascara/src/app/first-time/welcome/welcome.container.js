import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {closeWelcomeScreen} from "../../../../../ui/app/actions";
import Welcome from "./welcome.component";


function mapStateToProps ({metamask}) {
  const {welcomeScreenSeen} = metamask;
  return {
    welcomeScreenSeen,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    closeWelcomeScreen: () => dispatch(closeWelcomeScreen()),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Welcome);
