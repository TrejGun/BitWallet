import {connect} from "react-redux";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import {setAccountLabel, showModal} from "../../../../actions";
import AccountDetails from "./details.component";
import {injectIntl} from "react-intl";
import withLoader from "../../../form/withLoader";
import withForm from "../../../form/withForm";
import {getCurrentNetwork, getSelectedIdentity} from "../../../../selectors";


function mapStateToProps ({metamask}) {
  const {identities} = metamask;

  return {
    identities,
    network: getCurrentNetwork(metamask),
    selectedIdentity: getSelectedIdentity(metamask),
  };
}

function mapDispatchToProps (dispatch) {
  return {
    showExportPrivateKeyModal: () => dispatch(showModal({name: "EXPORT_PRIVATE_KEY"})),
    setAccountLabel: (address, label) => dispatch(setAccountLabel(address, label)),
  };
}

export default compose(
  injectIntl,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withLoader("account"),
  withForm,
)(AccountDetails);


