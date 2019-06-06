import {
  CLEAR_NOTICES,
  CLEAR_SEED_WORD_CACHE,
  CLOSE_WELCOME_SCREEN,
  COMPLETED_TX,
  LOCK_METAMASK,
  PAIR_UPDATE,
  SET_ACCOUNT_LABEL,
  SET_CURRENT_FIAT,
  SET_PROVIDER_TYPE,
  SET_RPC_LIST,
  SET_RPC_TARGET,
  SET_SELECTED_TOKEN_ADDRESS,
  SHAPESHIFT_SUBVIEW,
  SHOW_ACCOUNT_DETAIL,
  SHOW_ACCOUNTS_PAGE,
  SHOW_NEW_VAULT_SEED,
  SHOW_NOTICE,
  UNLOCK_METAMASK,
  UPDATE_METAMASK_STATE,
  UPDATE_TOKENS,
  UPDATE_TRANSACTION_PARAMS,
} from "../actions";
import MetamascaraPlatform from "../../../app/scripts/platforms/window";
import {getEnvironmentType} from "../../../app/scripts/lib/util";
import {ENVIRONMENT_TYPE_POPUP} from "../../../app/scripts/lib/enums";


export default function reduceMetamask (state, action) {
  let newState;

  // clone + defaults
  var metamaskState = Object.assign({
    isInitialized: false,
    isUnlocked: false,
    isMascara: window.platform instanceof MetamascaraPlatform,
    isPopup: getEnvironmentType(window.location.href) === ENVIRONMENT_TYPE_POPUP,
    rpcTarget: "https://rawtestrpc.metamask.io/",
    identities: {},
    unapprovedTxs: {},
    noActiveNotices: true,
    nextUnreadNotice: undefined,
    frequentRpcList: [],
    addressBook: [],
    selectedTokenAddress: null,
    contractExchangeRates: {},
    tokenExchangeRates: {},
    tokens: [],
    coinOptions: {},
    featureFlags: {},
    isRevealingSeedWords: false,
    welcomeScreenSeen: false,
    currentLocale: "",
  }, state);

  switch (action.type) {

    case SHOW_ACCOUNTS_PAGE:
      newState = Object.assign(metamaskState, {
        isRevealingSeedWords: false,
      });
      delete newState.seedWords;
      return newState;

    case SHOW_NOTICE:
      return Object.assign(metamaskState, {
        noActiveNotices: false,
        nextUnreadNotice: action.value,
      });

    case CLEAR_NOTICES:
      return Object.assign(metamaskState, {
        noActiveNotices: true,
      });

    case UPDATE_METAMASK_STATE:
      return Object.assign(metamaskState, action.value);

    case UNLOCK_METAMASK:
      return Object.assign(metamaskState, {
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      });

    case LOCK_METAMASK:
      return Object.assign(metamaskState, {
        isUnlocked: false,
      });

    case SET_RPC_LIST:
      return Object.assign(metamaskState, {
        frequentRpcList: action.value,
      });

    case SET_RPC_TARGET:
      return Object.assign(metamaskState, {
        provider: {
          type: "rpc",
          rpcTarget: action.value,
        },
      });

    case SET_PROVIDER_TYPE:
      return Object.assign(metamaskState, {
        provider: {
          type: action.value,
        },
      });

    case COMPLETED_TX:
      var stringId = String(action.id);
      newState = Object.assign(metamaskState, {
        unapprovedTxs: {},
        unapprovedMsgs: {},
      });
      for (const id in metamaskState.unapprovedTxs) {
        if (id !== stringId) {
          newState.unapprovedTxs[id] = metamaskState.unapprovedTxs[id];
        }
      }
      for (const id in metamaskState.unapprovedMsgs) {
        if (id !== stringId) {
          newState.unapprovedMsgs[id] = metamaskState.unapprovedMsgs[id];
        }
      }
      return newState;

    case SHOW_NEW_VAULT_SEED:
      return Object.assign(metamaskState, {
        isRevealingSeedWords: true,
        seedWords: action.value,
      });

    case CLEAR_SEED_WORD_CACHE:
      newState = Object.assign(metamaskState, {
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      });
      delete newState.seedWords;
      return newState;

    case SHOW_ACCOUNT_DETAIL:
      newState = Object.assign(metamaskState, {
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      });
      delete newState.seedWords;
      return newState;

    case SET_SELECTED_TOKEN_ADDRESS:
      return Object.assign(metamaskState, {
        selectedTokenAddress: action.value,
      });

    case SET_ACCOUNT_LABEL:
      const account = action.value.account;
      const name = action.value.label;
      const id = {};
      id[account] = Object.assign(metamaskState.identities[account], {name});
      const identities = Object.assign(metamaskState.identities, id);
      return Object.assign(metamaskState, {identities});

    case SET_CURRENT_FIAT:
      return Object.assign(metamaskState, {
        currentCurrency: action.value.currentCurrency,
        conversionRate: action.value.conversionRate,
        conversionDate: action.value.conversionDate,
      });

    case UPDATE_TOKENS:
      return Object.assign(metamaskState, {
        tokens: action.tokens,
      });

    case UPDATE_TRANSACTION_PARAMS:
      const {id: txId, value} = action;
      let {selectedAddressTxList} = metamaskState;
      selectedAddressTxList = selectedAddressTxList.map(tx => {
        if (tx.id === txId) {
          tx.txParams = value;
        }
        return tx;
      });

      return Object.assign(metamaskState, {
        selectedAddressTxList,
      });

    case PAIR_UPDATE:
      const {value: {marketinfo: pairMarketInfo}} = action;
      return Object.assign(metamaskState, {
        tokenExchangeRates: {
          ...metamaskState.tokenExchangeRates,
          [pairMarketInfo.pair]: pairMarketInfo,
        },
      });

    case SHAPESHIFT_SUBVIEW:
      const {value: {marketinfo: ssMarketInfo, coinOptions}} = action;
      return Object.assign(metamaskState, {
        tokenExchangeRates: {
          ...metamaskState.tokenExchangeRates,
          [ssMarketInfo.pair]: ssMarketInfo,
        },
        coinOptions,
      });

    case CLOSE_WELCOME_SCREEN:
      return Object.assign(metamaskState, {
        welcomeScreenSeen: true,
      });

    default:
      return metamaskState;

  }
}
