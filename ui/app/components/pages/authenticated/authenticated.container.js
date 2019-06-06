import {connect} from "react-redux";
import AuthenticatedComponent from "./authenticated.component";


function mapStateToProps ({metamask}) {
  return {
    isUnlocked: metamask.isUnlocked,
    isInitialized: metamask.isInitialized,
  };
}

export default connect(mapStateToProps)(AuthenticatedComponent);
