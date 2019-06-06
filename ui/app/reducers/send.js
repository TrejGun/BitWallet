import {CLEAR_SEND, UPDATE_MAX_MODE, UPDATE_SEND, UPDATE_TOKEN_BALANCE} from "../actions";


export default function reduceSend (state, action) {

  const sendState = Object.assign({
    gasLimit: null,
    gasPrice: null,
    gasTotal: null,
    tokenBalance: null,
    from: "",
    to: "",
    amount: "0x0",
    memo: "",
    errors: {},
    maxModeOn: false,
    editingTransactionId: null,
    forceGasMin: null,
    toNickname: "",
  }, state);

  switch (action.type) {

    case UPDATE_TOKEN_BALANCE:
      return Object.assign(sendState, {
        tokenBalance: action.value,
      });

    case UPDATE_MAX_MODE:
      return Object.assign(sendState, {
        maxModeOn: action.value,
      });

    case UPDATE_SEND:
      return Object.assign(sendState, action.value);

    case CLEAR_SEND:
      return Object.assign(sendState, {
        send: {
          gasLimit: null,
          gasPrice: null,
          gasTotal: null,
          tokenBalance: null,
          from: "",
          to: "",
          amount: "0x0",
          memo: "",
          errors: {},
          editingTransactionId: null,
          forceGasMin: null,
        },
      });

    default:
      return sendState;

  }
}
