import {hideLoadingIndication, showLoadingIndication} from "../../../actions";


export function getTokens (address) {
  return async (dispatch) => {
    dispatch(showLoadingIndication());
    const response = await fetch(`https://api.token.store/portfolio/${address}`);
    const tokens = await response.json();
    dispatch(hideLoadingIndication());
    return tokens;
  };
}

