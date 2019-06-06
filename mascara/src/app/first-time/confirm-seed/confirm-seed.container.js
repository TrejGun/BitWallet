import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {confirmSeedWords, showModal} from "../../../../../ui/app/actions";
import ConfirmSeed from "./confirm-seed.component";
import withLoader from "../../../../../ui/app/components/form/withLoader";


function mapStateToProps ({metamask}) {
  const {seedWords} = metamask;

  return {
    seedWords,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    confirmSeedWords: () => dispatch(confirmSeedWords()),
    openBuyEtherModal: () => dispatch(showModal({name: "DEPOSIT_ETHER"})),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withLoader("account"),
)(ConfirmSeed);
