import {
  BACK_TO_ACCOUNT_DETAIL,
  BACK_TO_INIT_MENU,
  BACK_TO_UNLOCK_VIEW,
  BUY_ETH_VIEW,
  CLEAR_SEED_WORD_CACHE,
  COINBASE_SUBVIEW,
  COMPLETED_TX,
  CREATE_NEW_VAULT_IN_PROGRESS,
  DISPLAY_WARNING,
  EXPORT_ACCOUNT,
  FORGOT_PASSWORD,
  GAS_LOADING_FINISHED,
  GAS_LOADING_STARTED,
  GO_HOME,
  HIDE_LOADING,
  HIDE_SUB_LOADING_INDICATION,
  HIDE_WARNING,
  LOCK_METAMASK,
  MODAL_CLOSE,
  MODAL_OPEN,
  NEW_ACCOUNT_SCREEN,
  ONBOARDING_BUY_ETH_VIEW,
  PAIR_UPDATE,
  REQUEST_ACCOUNT_EXPORT,
  REVEAL_ACCOUNT,
  SET_NEW_ACCOUNT_FORM,
  SET_SELECTED_ACCOUNT,
  SHAPESHIFT_SUBVIEW,
  SHOW_ACCOUNT_DETAIL,
  SHOW_ACCOUNTS_PAGE,
  SHOW_ADD_TOKEN_PAGE,
  SHOW_CONF_MSG_PAGE,
  SHOW_CONF_TX_PAGE,
  SHOW_CONFIG_PAGE,
  SHOW_CREATE_VAULT,
  SHOW_IMPORT_PAGE,
  SHOW_INFO_PAGE,
  SHOW_INIT_MENU,
  SHOW_LOADING,
  SHOW_NEW_ACCOUNT_PAGE,
  SHOW_NEW_VAULT_SEED,
  SHOW_NOTICE,
  SHOW_PRIVATE_KEY,
  SHOW_QR,
  SHOW_QR_VIEW,
  SHOW_RESTORE_VAULT,
  SHOW_SUB_LOADING_INDICATION,
  TRANSACTION_ERROR,
  TRANSITION_BACKWARD,
  TRANSITION_FORWARD,
  UNLOCK_FAILED,
  UNLOCK_METAMASK,
  UNLOCK_SUCCEEDED,
} from "../actions";
import log from "loglevel";


export default function reduceApp (state, action) {
  log.debug("App Reducer got " + action.type);
  // clone and defaults

  // default state
  var appState = Object.assign({
    shouldClose: false,
    menuOpen: false,
    modal: {
      open: false,
      modalState: {
        name: null,
        props: {},
      },
      previousModalState: {
        name: null,
      },
    },
    networkDropdownOpen: false,
    accountDetail: {
      subview: "transactions",
    },
    // Used to render transition direction
    transForward: true,
    // Used to display loading indicator
    isLoading: false,
    // Used to display error text
    warning: null,
    buyView: {},
    gasIsLoading: false,
  }, state);

  switch (action.type) {

    // modal methods:
    case MODAL_OPEN:
      const {name, ...modalProps} = action.payload;

      return Object.assign(appState, {
        modal: {
          open: true,
          modalState: {
            name: name,
            props: {...modalProps},
          },
          previousModalState: {...appState.modal.modalState},
        },
      });

    case MODAL_CLOSE:
      return Object.assign(appState, {
        modal: Object.assign(
          state.modal,
          {open: false},
          {modalState: {name: null, props: {}}},
          {previousModalState: appState.modal.modalState},
        ),
      });

    // transition methods
    case TRANSITION_FORWARD:
      return Object.assign(appState, {
        transForward: true,
      });

    case TRANSITION_BACKWARD:
      return Object.assign(appState, {
        transForward: false,
      });

    // intialize

    case SHOW_CREATE_VAULT:
      return Object.assign(appState, {
        transForward: true,
        warning: null,
      });

    case SHOW_RESTORE_VAULT:
      return Object.assign(appState, {
        transForward: true,
        forgottenPassword: true,
      });

    case FORGOT_PASSWORD:
      return Object.assign(appState, {
        forgottenPassword: action.value,
      });

    case SHOW_INIT_MENU:
      return Object.assign(appState, {
        transForward: false,
      });

    case SHOW_CONFIG_PAGE:
      return Object.assign(appState, {
        transForward: action.value,
      });

    case SHOW_ADD_TOKEN_PAGE:
      return Object.assign(appState, {
        transForward: action.value,
      });

    case SHOW_IMPORT_PAGE:
      return Object.assign(appState, {
        transForward: true,
        warning: null,
      });

    case SHOW_NEW_ACCOUNT_PAGE:
      return Object.assign(appState, {
        transForward: true,
        warning: null,
      });

    case SET_NEW_ACCOUNT_FORM:
      return Object.assign(appState, {

      });

    case SHOW_INFO_PAGE:
      return Object.assign(appState, {
        transForward: true,
      });

    case CREATE_NEW_VAULT_IN_PROGRESS:
      return Object.assign(appState, {
        transForward: true,
        isLoading: true,
      });

    case SHOW_NEW_VAULT_SEED:
      return Object.assign(appState, {
        transForward: true,
        isLoading: false,
      });

    case NEW_ACCOUNT_SCREEN:
      return Object.assign(appState, {
        transForward: true,
      });

    // unlock

    case UNLOCK_METAMASK:
      return Object.assign(appState, {
        forgottenPassword: appState.forgottenPassword ? !appState.forgottenPassword : null,
        detailView: {},
        transForward: true,
        isLoading: false,
        warning: null,
      });

    case LOCK_METAMASK:
      return Object.assign(appState, {
        transForward: false,
        warning: null,
      });

    case BACK_TO_INIT_MENU:
      return Object.assign(appState, {
        warning: null,
        transForward: false,
        forgottenPassword: true,
      });

    case BACK_TO_UNLOCK_VIEW:
      return Object.assign(appState, {
        warning: null,
        transForward: true,
        forgottenPassword: false,

      });

    // accounts

    case SET_SELECTED_ACCOUNT:
      return Object.assign(appState, {
        activeAddress: action.value,
      });

    case GO_HOME:
      return Object.assign(appState, {
        accountDetail: {
          subview: "transactions",
          accountExport: "none",
          privateKey: "",
        },
        transForward: false,
        warning: null,
      });

    case SHOW_ACCOUNT_DETAIL:
      return Object.assign(appState, {
        forgottenPassword: appState.forgottenPassword ? !appState.forgottenPassword : null,
        accountDetail: {
          subview: "transactions",
          accountExport: "none",
          privateKey: "",
        },
        transForward: false,
      });

    case BACK_TO_ACCOUNT_DETAIL:
      return Object.assign(appState, {
        accountDetail: {
          subview: "transactions",
          accountExport: "none",
          privateKey: "",
        },
        transForward: false,
      });

    case SHOW_ACCOUNTS_PAGE:
      return Object.assign(appState, {
        transForward: true,
        isLoading: false,
        warning: null,
        scrollToBottom: false,
        forgottenPassword: false,
      });

    case SHOW_NOTICE:
      return Object.assign(appState, {
        transForward: true,
        isLoading: false,
      });

    case REVEAL_ACCOUNT:
      return Object.assign(appState, {
        scrollToBottom: true,
      });

    case SHOW_CONF_TX_PAGE:
      return Object.assign(appState, {
        transForward: action.transForward,
        warning: null,
        isLoading: false,
      });

    case SHOW_CONF_MSG_PAGE:
      return Object.assign(appState, {
        transForward: true,
        warning: null,
        isLoading: false,
      });

    case COMPLETED_TX:
      log.debug("reducing COMPLETED_TX for tx " + action.value);
      const otherUnconfActions = [] // getUnconfActionList(state)
        .filter(tx => tx.id !== action.value);
      const hasOtherUnconfActions = otherUnconfActions.length > 0;

      if (hasOtherUnconfActions) {
        log.debug("reducer detected txs - rendering confTx view");
        return Object.assign(appState, {
          transForward: false,
          warning: null,
        });
      } else {
        log.debug("attempting to close popup");
        return Object.assign(appState, {
          // indicate notification should close
          shouldClose: true,
          transForward: false,
          warning: null,
          accountDetail: {
            subview: "transactions",
          },
        });
      }

    case TRANSACTION_ERROR:
      return Object.assign(appState, {

      });

    case UNLOCK_FAILED:
      return Object.assign(appState, {
        warning: action.value || "Incorrect password. Try again.",
      });

    case UNLOCK_SUCCEEDED:
      return Object.assign(appState, {
        warning: "",
      });

    case SHOW_LOADING:
      return Object.assign(appState, {
        isLoading: true,
        loadingMessage: action.value,
      });

    case HIDE_LOADING:
      return Object.assign(appState, {
        isLoading: false,
      });

    case SHOW_SUB_LOADING_INDICATION:
      return Object.assign(appState, {
        isSubLoading: true,
      });

    case HIDE_SUB_LOADING_INDICATION:
      return Object.assign(appState, {
        isSubLoading: false,
      });
    case CLEAR_SEED_WORD_CACHE:
      return Object.assign(appState, {
        transForward: true,
        isLoading: false,
        accountDetail: {
          subview: "transactions",
          accountExport: "none",
          privateKey: "",
        },
      });

    case DISPLAY_WARNING:
      return Object.assign(appState, {
        warning: action.value,
        isLoading: false,
      });

    case HIDE_WARNING:
      return Object.assign(appState, {
        warning: undefined,
      });

    case REQUEST_ACCOUNT_EXPORT:
      return Object.assign(appState, {
        transForward: true,
        accountDetail: {
          subview: "export",
          accountExport: "requested",
        },
      });

    case EXPORT_ACCOUNT:
      return Object.assign(appState, {
        accountDetail: {
          subview: "export",
          accountExport: "completed",
        },
      });

    case SHOW_PRIVATE_KEY:
      return Object.assign(appState, {
        accountDetail: {
          subview: "export",
          accountExport: "completed",
          privateKey: action.value,
        },
      });

    case BUY_ETH_VIEW:
      return Object.assign(appState, {
        transForward: true,
        buyView: {
          subview: "Coinbase",
          amount: "15.00",
          buyAddress: action.value,
          formView: {
            coinbase: true,
            shapeshift: false,
          },
        },
      });

    case ONBOARDING_BUY_ETH_VIEW:
      return Object.assign(appState, {
        transForward: true,
      });

    case COINBASE_SUBVIEW:
      return Object.assign(appState, {
        buyView: {
          subview: "Coinbase",
          formView: {
            coinbase: true,
            shapeshift: false,
          },
          buyAddress: appState.buyView.buyAddress,
          amount: appState.buyView.amount,
        },
      });

    case SHAPESHIFT_SUBVIEW:
      return Object.assign(appState, {
        buyView: {
          subview: "ShapeShift",
          formView: {
            coinbase: false,
            shapeshift: true,
            marketinfo: action.value.marketinfo,
            coinOptions: action.value.coinOptions,
          },
          buyAddress: action.value.buyAddress || appState.buyView.buyAddress,
          amount: appState.buyView.amount || 0,
        },
      });

    case PAIR_UPDATE:
      return Object.assign(appState, {
        buyView: {
          subview: "ShapeShift",
          formView: {
            coinbase: false,
            shapeshift: true,
            marketinfo: action.value.marketinfo,
            coinOptions: appState.buyView.formView.coinOptions,
          },
          buyAddress: appState.buyView.buyAddress,
          amount: appState.buyView.amount,
          warning: null,
        },
      });

    case SHOW_QR:
      return Object.assign(appState, {
        qrRequested: true,
        transForward: true,
      });

    case SHOW_QR_VIEW:
      return Object.assign(appState, {
        transForward: true,
      });

    case GAS_LOADING_STARTED:
      return Object.assign(appState, {
        gasIsLoading: true,
      });

    case GAS_LOADING_FINISHED:
      return Object.assign(appState, {
        gasIsLoading: false,
      });

    default:
      return appState;
  }
}
