import abi from "human-standard-token-abi";
import pify from "pify";
import getBuyEthUrl from "../../app/scripts/lib/buy-eth-url";
import {getTokenAddressFromTokenObject} from "./util";
import {
  calcGasTotal,
  calcTokenBalance,
  estimateGas,
  estimateGasPriceFromRecentBlocks,
} from "./components/pages/send/send.utils";
import ethUtil from "ethereumjs-util";
import log from "loglevel";
import {updateIntl} from "react-intl-redux";
import {localization} from "./localization/setup";


var background = null;

export function _setBackgroundConnection (backgroundConnection) {
  background = backgroundConnection;
}

export function goHome () {
  return {
    type: GO_HOME,
  };
}

// async actions

export function tryUnlockMetamask (password) {
  return dispatch => {
    dispatch(showLoadingIndication());
    dispatch(unlockInProgress());
    log.debug("background.submitPassword");

    return new Promise((resolve, reject) => {
      background.submitPassword(password, error => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    })
      .then(() => {
        dispatch(unlockSucceeded());
        return forceUpdateMetamaskState(dispatch);
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          background.verifySeedPhrase(err => {
            if (err) {
              dispatch(displayWarning(err.message));
              return reject(err);
            }

            resolve();
          });
        });
      })
      .then(() => {
        dispatch(transitionForward());
        dispatch(hideLoadingIndication());
      })
      .catch(err => {
        dispatch(unlockFailed(err.message));
        dispatch(hideLoadingIndication());
        return Promise.reject(err);
      });
  };
}

export function transitionForward () {
  return {
    type: TRANSITION_FORWARD,
  };
}

export function transitionBackward () {
  return {
    type: TRANSITION_BACKWARD,
  };
}

export function confirmSeedWords () {
  return dispatch => {
    dispatch(showLoadingIndication());
    log.debug("background.clearSeedWordCache");
    return new Promise((resolve, reject) => {
      background.clearSeedWordCache((err, account) => {
        dispatch(hideLoadingIndication());
        if (err) {
          dispatch(displayWarning(err.message));
          return reject(err);
        }

        log.info("Seed word cache cleared. " + account);
        dispatch(showAccountsPage());
        resolve(account);
      });
    });
  };
}

export function createNewVaultAndRestore (password, seed) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    log.debug("background.createNewVaultAndRestore");

    return background.createNewVaultAndRestore(password, seed)
      .then(() => dispatch(unMarkPasswordForgotten()))
      .then(() => {
        dispatch(showAccountsPage());
        dispatch(hideLoadingIndication());
      })
      .catch(err => {
        dispatch(displayWarning(err.message));
        dispatch(hideLoadingIndication());
      });
  };
}

export function createNewVaultAndKeychain (password) {
  return dispatch => {
    dispatch(showLoadingIndication());
    log.debug("background.createNewVaultAndKeychain");

    return new Promise((resolve, reject) => {
      background.createNewVaultAndKeychain(password, err => {
        if (err) {
          dispatch(displayWarning(err.message));
          return reject(err);
        }

        log.debug("background.placeSeedWords");

        background.placeSeedWords((err) => {
          if (err) {
            dispatch(displayWarning(err.message));
            return reject(err);
          }

          resolve();
        });
      });
    })
      .then(() => forceUpdateMetamaskState(dispatch))
      .then(() => dispatch(hideLoadingIndication()))
      .catch(() => dispatch(hideLoadingIndication()));
  };
}

export function verifyPassword (password) {
  return new Promise((resolve, reject) => {
    background.submitPassword(password, error => {
      if (error) {
        return reject(error);
      }

      resolve(true);
    });
  });
}

export function verifySeedPhrase () {
  return new Promise((resolve, reject) => {
    background.verifySeedPhrase((error, seedWords) => {
      if (error) {
        return reject(error);
      }

      resolve(seedWords);
    });
  });
}

export function requestRevealSeed (password) {
  return dispatch => {
    dispatch(showLoadingIndication());
    log.debug("background.submitPassword");
    return new Promise((resolve, reject) => {
      background.submitPassword(password, err => {
        if (err) {
          dispatch(displayWarning(err.message));
          return reject(err);
        }

        log.debug("background.placeSeedWords");
        background.placeSeedWords((err, result) => {
          if (err) {
            dispatch(displayWarning(err.message));
            return reject(err);
          }

          dispatch(showNewVaultSeed(result));
          dispatch(hideLoadingIndication());
          resolve();
        });
      });
    });
  };
}

export function requestRevealSeedWords (password) {
  return async dispatch => {
    dispatch(showLoadingIndication());
    log.debug("background.submitPassword");

    try {
      await verifyPassword(password);
      const seedWords = await verifySeedPhrase();
      dispatch(hideLoadingIndication());
      return seedWords;
    } catch (error) {
      dispatch(hideLoadingIndication());
      dispatch(displayWarning(error.message));
      throw new Error(error.message);
    }
  };
}

export function resetAccount () {
  return dispatch => {
    dispatch(showLoadingIndication());

    return new Promise((resolve, reject) => {
      background.resetAccount((err, account) => {
        dispatch(hideLoadingIndication());
        if (err) {
          dispatch(displayWarning(err.message));
          return reject(err);
        }

        log.info("Transaction history reset for " + account);
        dispatch(showAccountsPage());
        resolve(account);
      });
    });
  };
}

export function addNewKeyring (type, opts) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    log.debug("background.addNewKeyring");
    background.addNewKeyring(type, opts, (err) => {
      dispatch(hideLoadingIndication());
      if (err) {
        return dispatch(displayWarning(err.message));
      }
      dispatch(showAccountsPage());
    });
  };
}

export function importNewAccount (password, strategy, args) {
  return async (dispatch) => {
    let newState;
    dispatch(showLoadingIndication("This may take a while, please be patient."));
    try {
      log.debug("background.importAccountWithStrategy");
      await background.importAccountWithStrategy(strategy, args);
      log.debug("background.getState");
      newState = await pify(background.getState).call(background);
    } catch (err) {
      dispatch(hideLoadingIndication());
      dispatch(displayWarning(err.message));
      throw err;
    }
    dispatch(hideLoadingIndication());
    dispatch(updateMetamaskState(newState));
    if (newState.selectedAddress) {
      dispatch({
        type: SHOW_ACCOUNT_DETAIL,
        value: newState.selectedAddress,
      });
    }
    return newState;
  };
}

export function addNewAccount () {
  log.debug("background.addNewAccount");
  return (dispatch, getState) => {
    const oldIdentities = getState().metamask.identities;
    dispatch(showLoadingIndication());
    return new Promise((resolve, reject) => {
      background.addNewAccount((err, {identities: newIdentities}) => {
        if (err) {
          dispatch(displayWarning(err.message));
          return reject(err);
        }
        const newAccountAddress = Object.keys(newIdentities).find(address => !oldIdentities[address]);

        dispatch(hideLoadingIndication());

        forceUpdateMetamaskState(dispatch);
        return resolve(newAccountAddress);
      });
    });
  };
}


export function setCurrentCurrency (currencyCode) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    log.debug("background.setCurrentCurrency");
    background.setCurrentCurrency(currencyCode, (err, data) => {
      dispatch(hideLoadingIndication());
      if (err) {
        log.error(err.stack);
        return dispatch(displayWarning(err.message));
      }
      dispatch({
        type: SET_CURRENT_FIAT,
        value: {
          currentCurrency: data.currentCurrency,
          conversionRate: data.conversionRate,
          conversionDate: data.conversionDate,
        },
      });
    });
  };
}

export function signMsg (msgData) {
  log.debug("action - signMsg");
  return (dispatch) => {
    dispatch(showLoadingIndication());

    return new Promise((resolve, reject) => {
      log.debug("calling background.signMessage");
      background.signMessage(msgData, (err, newState) => {
        log.debug("signMessage called back");
        dispatch(updateMetamaskState(newState));
        dispatch(hideLoadingIndication());

        if (err) {
          log.error(err);
          dispatch(displayWarning(err.message));
          return reject(err);
        }

        dispatch(completedTx(msgData.metamaskId));
        return resolve(msgData);
      });
    });
  };
}

export function signPersonalMsg (msgData) {
  log.debug("action - signPersonalMsg");
  return dispatch => {
    dispatch(showLoadingIndication());

    return new Promise((resolve, reject) => {
      log.debug("calling background.signPersonalMessage");
      background.signPersonalMessage(msgData, (err, newState) => {
        log.debug("signPersonalMessage called back");
        dispatch(updateMetamaskState(newState));
        dispatch(hideLoadingIndication());

        if (err) {
          log.error(err);
          dispatch(displayWarning(err.message));
          return reject(err);
        }

        dispatch(completedTx(msgData.metamaskId));
        return resolve(msgData);
      });
    });
  };
}

export function signTypedMsg (msgData) {
  log.debug("action - signTypedMsg");
  return (dispatch) => {
    dispatch(showLoadingIndication());

    return new Promise((resolve, reject) => {
      log.debug("calling background.signTypedMessage");
      background.signTypedMessage(msgData, (err, newState) => {
        log.debug("signTypedMessage called back");
        dispatch(updateMetamaskState(newState));
        dispatch(hideLoadingIndication());

        if (err) {
          log.error(err);
          dispatch(displayWarning(err.message));
          return reject(err);
        }

        dispatch(completedTx(msgData.metamaskId));
        return resolve(msgData);
      });
    });
  };
}

export function signTx (txData) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    global.ethQuery.sendTransaction(txData, (err, data) => {
      dispatch(hideLoadingIndication());
      if (err) {
        return dispatch(displayWarning(err.message));
      }
      dispatch(hideWarning());
    });
    dispatch(showConfTxPage({}));
  };
}

export function updateGasData ({blockGasLimit, recentBlocks, selectedAddress, selectedToken, to, value}) {
  return (dispatch) => {
    dispatch(gasLoadingStarted());
    const estimatedGasPrice = estimateGasPriceFromRecentBlocks(recentBlocks);
    return Promise.all([
      Promise.resolve(estimatedGasPrice),
      estimateGas({
        selectedAddress,
        selectedToken,
        blockGasLimit,
        to,
        value,
        gasPrice: estimatedGasPrice,
        estimateGasMethod: background.estimateGas,
      }),
    ])
      .then(([gasPrice, gasLimit]) => {
        dispatch(gasLoadingFinished());
        return {gasPrice, gasLimit, gasTotal: ethUtil.addHexPrefix(calcGasTotal(gasLimit, gasPrice))};
      });
  };
}

export function gasLoadingStarted () {
  return {
    type: GAS_LOADING_STARTED,
  };
}

export function gasLoadingFinished () {
  return {
    type: GAS_LOADING_FINISHED,
  };
}

export function updateTokenBalance ({selectedToken, tokenContract, address}) {
  return (dispatch) => {
    const tokenBalancePromise = tokenContract
      ? tokenContract.balanceOf(address)
      : Promise.resolve();
    return tokenBalancePromise
      .then(usersToken => {
        if (usersToken) {
          const newTokenBalance = calcTokenBalance({selectedToken, usersToken});
          dispatch(setTokenBalance(newTokenBalance.toString(10)));
        }
      });
  };
}


export function setTokenBalance (tokenBalance) {
  return {
    type: UPDATE_TOKEN_BALANCE,
    value: tokenBalance,
  };
}

export function updateSend (newSend) {
  return {
    type: UPDATE_SEND,
    value: newSend,
  };
}

export function clearSend () {
  return {
    type: CLEAR_SEND,
  };
}

export function sendTx (txData) {
  log.info(`- sendTx: ${JSON.stringify(txData.txParams)}`);
  return (dispatch) => {
    log.debug("calling background.approveTransaction");
    background.approveTransaction(txData.id, (err) => {
      if (err) {
        dispatch(txError(err));
        return log.error(err.message);
      }
      dispatch(completedTx(txData.id));
    });
  };
}

export function signTokenTx (tokenAddress, toAddress, amount, txData) {
  return dispatch => {
    dispatch(showLoadingIndication());
    const token = global.eth.contract(abi).at(tokenAddress);
    token.transfer(toAddress, ethUtil.addHexPrefix(amount), txData)
      .catch(err => {
        dispatch(hideLoadingIndication());
        dispatch(displayWarning(err.message));
      });
    dispatch(showConfTxPage({}));
  };
}

export function updateTransaction (txData) {
  log.info(" updateTx: " + JSON.stringify(txData));
  return (dispatch) => {
    log.debug("calling background.updateTx");
    background.updateTransaction(txData, (err) => {
      dispatch(hideLoadingIndication());
      dispatch(updateTransactionParams(txData.id, txData.txParams));
      if (err) {
        dispatch(txError(err));
        dispatch(goHome());
        return log.error(err.message);
      }
      dispatch(showConfTxPage({id: txData.id}));
    });
  };
}

export function updateAndApproveTx (txData) {
  log.info(" updateAndApproveTx: " + JSON.stringify(txData));
  return (dispatch) => {
    log.debug("calling background.updateAndApproveTx");

    return background.updateAndApproveTransaction(txData)
      .then(() => {
        dispatch(hideLoadingIndication());
        dispatch(updateTransactionParams(txData.id, txData.txParams)); // ?
        dispatch(completedTx(txData.id));
        return txData;
      })
      .catch(err => {
        dispatch(hideLoadingIndication());
        dispatch(updateTransactionParams(txData.id, txData.txParams)); // ?
        dispatch(txError(err));
        throw err;
      });
  };
}

export function completedTx (id) {
  return {
    type: COMPLETED_TX,
    value: id,
  };
}

export function updateTransactionParams (id, txParams) {
  return {
    type: UPDATE_TRANSACTION_PARAMS,
    id,
    value: txParams,
  };
}

export function txError (err) {
  return {
    type: TRANSACTION_ERROR,
    message: err.message,
  };
}

export function cancelMsg (msgData) {
  return dispatch => {
    dispatch(showLoadingIndication());

    return new Promise((resolve, reject) => {
      log.debug("background.cancelMessage");
      background.cancelMessage(msgData.id, (err, newState) => {
        dispatch(updateMetamaskState(newState));
        dispatch(hideLoadingIndication());

        if (err) {
          return reject(err);
        }

        dispatch(completedTx(msgData.id));
        return resolve(msgData);
      });
    });
  };
}

export function cancelPersonalMsg (msgData) {
  return dispatch => {
    dispatch(showLoadingIndication());

    return new Promise((resolve, reject) => {
      const id = msgData.id;
      background.cancelPersonalMessage(id, (err, newState) => {
        dispatch(updateMetamaskState(newState));
        dispatch(hideLoadingIndication());

        if (err) {
          return reject(err);
        }

        dispatch(completedTx(id));
        return resolve(msgData);
      });
    });
  };
}

export function cancelTypedMsg (msgData) {
  return dispatch => {
    dispatch(showLoadingIndication());

    return new Promise((resolve, reject) => {
      const id = msgData.id;
      background.cancelTypedMessage(id, (err, newState) => {
        dispatch(updateMetamaskState(newState));
        dispatch(hideLoadingIndication());

        if (err) {
          return reject(err);
        }

        dispatch(completedTx(id));
        return resolve(msgData);
      });
    });
  };
}

export function cancelTx (txData) {
  return dispatch => {
    log.debug("background.cancelTransaction");
    return new Promise((resolve, reject) => {
      background.cancelTransaction(txData.id, () => {
        dispatch(completedTx(txData.id));
        resolve(txData);
      });
    });
  };
}

export function cancelAllTx (txsData) {
  return (dispatch) => {
    txsData.forEach((txData, i) => {
      background.cancelTransaction(txData.id, () => {
        dispatch(completedTx(txData.id));
        i === txsData.length - 1 ? dispatch(goHome()) : null;
      });
    });
  };
}

//
// initialize screen
//

export function markPasswordForgotten () {
  return (dispatch) => {
    return background.markPasswordForgotten(() => {
      dispatch(hideLoadingIndication());
      dispatch(forgotPassword());
      forceUpdateMetamaskState(dispatch);
    });
  };
}

export function unMarkPasswordForgotten () {
  return dispatch => {
    return new Promise(resolve => {
      background.unMarkPasswordForgotten(() => {
        dispatch(forgotPassword(false));
        resolve();
      });
    })
      .then(() => forceUpdateMetamaskState(dispatch));
  };
}

export function forgotPassword (forgotPasswordState = true) {
  return {
    type: FORGOT_PASSWORD,
    value: forgotPasswordState,
  };
}

export function showNewVaultSeed (seed) {
  return {
    type: SHOW_NEW_VAULT_SEED,
    value: seed,
  };
}

export function closeWelcomeScreen () {
  return {
    type: CLOSE_WELCOME_SCREEN,
  };
}

//
// unlock screen
//

export function unlockInProgress () {
  return {
    type: UNLOCK_IN_PROGRESS,
  };
}

export function unlockFailed (message) {
  return {
    type: UNLOCK_FAILED,
    value: message,
  };
}

export function unlockSucceeded (message) {
  return {
    type: UNLOCK_SUCCEEDED,
    value: message,
  };
}

export function unlockMetamask (account) {
  return {
    type: UNLOCK_METAMASK,
    value: account,
  };
}

export function updateMetamaskState (newState) {
  return {
    type: UPDATE_METAMASK_STATE,
    value: newState,
  };
}

const backgroundSetLocked = () => {
  return new Promise((resolve, reject) => {
    background.setLocked(error => {
      if (error) {
        return reject(error);
      }

      resolve();
    });
  });
};

const updateMetamaskStateFromBackground = () => {
  log.debug("background.getState");

  return new Promise((resolve, reject) => {
    background.getState((error, newState) => {
      if (error) {
        return reject(error);
      }

      resolve(newState);
    });
  });
};

export function lockMetamask () {
  log.debug("background.setLocked");

  return dispatch => {
    dispatch(showLoadingIndication());

    return backgroundSetLocked()
      .then(() => updateMetamaskStateFromBackground())
      .catch(error => {
        dispatch(displayWarning(error.message));
        return Promise.reject(error);
      })
      .then(newState => {
        dispatch(updateMetamaskState(newState));
        dispatch(hideLoadingIndication());
        dispatch({type: LOCK_METAMASK});
      })
      .catch(() => {
        dispatch(hideLoadingIndication());
        dispatch({type: LOCK_METAMASK});
      });
  };
}

export function setCurrentAccountTab (newTabName) {
  log.debug(`background.setCurrentAccountTab: ${newTabName}`);
  return callBackgroundThenUpdateNoSpinner(background.setCurrentAccountTab, newTabName);
}

export function setSelectedTokenAddress (tokenAddress) {
  return {
    type: SET_SELECTED_TOKEN_ADDRESS,
    value: tokenAddress,
  };
}

export function setSelectedAddress (address) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    log.debug("background.setSelectedAddress");
    background.setSelectedAddress(address)
      .then(() => {
        dispatch(hideLoadingIndication());
      })
      .catch(err => {
        dispatch(hideLoadingIndication());
        dispatch(displayWarning(err.message));
      });
  };
}

export function showAccountDetail (address) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    log.debug("background.setSelectedAddress");
    background.setSelectedAddress(address)
      .then(() => {
        dispatch(hideLoadingIndication());
        dispatch({
          type: SHOW_ACCOUNT_DETAIL,
          value: address,
        });
        dispatch(setSelectedTokenAddress());
      })
      .catch(err => {
        dispatch(hideLoadingIndication());
        dispatch(displayWarning(err.message));
      });
  };
}

export function backToAccountDetail (address) {
  return {
    type: BACK_TO_ACCOUNT_DETAIL,
    value: address,
  };
}

export function showAccountsPage () {
  return {
    type: SHOW_ACCOUNTS_PAGE,
  };
}

export function showConfTxPage ({transForward = true, id}) {
  return {
    type: SHOW_CONF_TX_PAGE,
    transForward,
    id,
  };
}

export function addToken (address, symbol, decimals) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    return new Promise((resolve, reject) => {
      background.addToken(address, symbol, decimals, (err, tokens) => {
        dispatch(hideLoadingIndication());
        if (err) {
          dispatch(displayWarning(err.message));
          reject(err);
        }
        dispatch(updateTokens(tokens));
        resolve(tokens);
      });
    });
  };
}

export function removeToken (address) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    return new Promise((resolve, reject) => {
      background.removeToken(address, (err, tokens) => {
        dispatch(hideLoadingIndication());
        if (err) {
          dispatch(displayWarning(err.message));
          reject(err);
        }
        dispatch(updateTokens(tokens));
        resolve(tokens);
      });
    });
  };
}

export function addTokens (tokens) {
  return dispatch => {
    if (Array.isArray(tokens)) {
      dispatch(setSelectedTokenAddress(getTokenAddressFromTokenObject(tokens[0])));
      return Promise.all(tokens.map(({address, symbol, decimals}) => (
        dispatch(addToken(address, symbol, decimals))
      )));
    } else {
      dispatch(setSelectedTokenAddress(getTokenAddressFromTokenObject(tokens)));
      return Promise.all(
        Object
          .entries(tokens)
          .map(([_, {address, symbol, decimals}]) => (
            dispatch(addToken(address, symbol, decimals))
          )),
      );
    }
  };
}

export function updateTokens (tokens) {
  return {
    type: UPDATE_TOKENS,
    tokens,
  };
}

export function goBackToInitView () {
  return {
    type: BACK_TO_INIT_MENU,
  };
}

//
// notice
//

export function markNoticeRead (notice) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    log.debug("background.markNoticeRead");
    return new Promise((resolve, reject) => {
      background.markNoticeRead(notice, (err, notice) => {
        dispatch(hideLoadingIndication());
        if (err) {
          dispatch(displayWarning(err));
          return reject(err);
        }

        if (notice) {
          dispatch(showNotice(notice));
          resolve(true);
        } else {
          dispatch(clearNotices());
          resolve(false);
        }
      });
    });
  };
}

export function showNotice (notice) {
  return {
    type: SHOW_NOTICE,
    value: notice,
  };
}

export function clearNotices () {
  return {
    type: CLEAR_NOTICES,
  };
}

export function markAccountsFound () {
  log.debug("background.markAccountsFound");
  return callBackgroundThenUpdate(background.markAccountsFound);
}

export function retryTransaction (txId) {
  log.debug("background.retryTransaction");
  let newTxId;

  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.retryTransaction(txId, (err, newState) => {
        if (err) {
          dispatch(displayWarning(err.message));
          reject(err);
        }

        const {selectedAddressTxList} = newState;
        const {id} = selectedAddressTxList[selectedAddressTxList.length - 1];
        newTxId = id;
        resolve(newState);
      });
    })
      .then(newState => dispatch(updateMetamaskState(newState)))
      .then(() => newTxId);
  };
}

//
// config
//

export function setProviderType (type) {
  return (dispatch) => {
    log.debug("background.setProviderType", type);
    return background.setProviderType(type)
      .then(() => {
        dispatch(updateProviderType(type));
        dispatch(setSelectedTokenAddress());
      })
      .catch(err => {
        log.error(err);
        dispatch(displayWarning("Had a problem changing networks!"));
      });

  };
}

export function updateProviderType (type) {
  return {
    type: SET_PROVIDER_TYPE,
    value: type,
  };
}

export function setRpcTarget (rpcTarget) {
  return (dispatch) => {
    log.debug(`background.setRpcTarget: ${rpcTarget}`);
    return background.setCustomRpc(rpcTarget)
      .then(() => {
        dispatch(updateRpcTarget(rpcTarget));
        dispatch(setSelectedTokenAddress());
      })
      .catch(err => {
        log.debug(err);
        dispatch(displayWarning("Had a problem changing networks!"));
      });
  };
}

export function updateRpcTarget (rpcTarget) {
  return {
    type: SET_RPC_TARGET,
    value: rpcTarget,
  };
}

// Calls the addressBookController to add a new address.
export function addToAddressBook (recipient, nickname = "") {
  log.debug("background.addToAddressBook");
  return (dispatch) => {
    background.setAddressBook(recipient, nickname, (err, result) => {
      if (err) {
        log.error(err);
        return dispatch(displayWarning("Address book failed to update"));
      }
    });
  };
}

export function useEtherscanProvider () {
  log.debug("background.useEtherscanProvider");
  background.useEtherscanProvider();
  return {
    type: USE_ETHERSCAN_PROVIDER,
  };
}

export function showModal (payload) {
  return {
    type: MODAL_OPEN,
    payload,
  };
}

export function hideModal (payload) {
  return {
    type: MODAL_CLOSE,
    payload,
  };
}


export function showLoadingIndication (message) {
  return {
    type: SHOW_LOADING,
    value: message,
  };
}

export function hideLoadingIndication () {
  return {
    type: HIDE_LOADING,
  };
}

export function showSubLoadingIndication () {
  return {
    type: SHOW_SUB_LOADING_INDICATION,
  };
}

export function hideSubLoadingIndication () {
  return {
    type: HIDE_SUB_LOADING_INDICATION,
  };
}

export function displayWarning (text) {
  return {
    type: DISPLAY_WARNING,
    value: text,
  };
}

export function hideWarning () {
  return {
    type: HIDE_WARNING,
  };
}

export function requestExportAccount () {
  return {
    type: REQUEST_ACCOUNT_EXPORT,
  };
}

export function exportAccount (password, address) {
  return function (dispatch) {
    dispatch(showLoadingIndication());

    log.debug("background.submitPassword");
    return new Promise((resolve, reject) => {
      background.submitPassword(password, function (err) {
        if (err) {
          log.error("Error in submiting password.");
          dispatch(hideLoadingIndication());
          dispatch(displayWarning("Incorrect Password."));
          return reject(err);
        }
        log.debug("background.exportAccount");
        return background.exportAccount(address, function (err, result) {
          dispatch(hideLoadingIndication());

          if (err) {
            log.error(err);
            dispatch(displayWarning("Had a problem exporting the account."));
            return reject(err);
          }

          // dispatch(exportAccountComplete())
          dispatch(showPrivateKey(result));

          return resolve(result);
        });
      });
    });
  };
}

export function showPrivateKey (key) {
  return {
    type: SHOW_PRIVATE_KEY,
    value: key,
  };
}

export function setAccountLabel (account, label) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    log.debug("background.setAccountLabel");

    return new Promise((resolve, reject) => {
      background.setAccountLabel(account, label, (err) => {
        dispatch(hideLoadingIndication());

        if (err) {
          dispatch(displayWarning(err.message));
          reject(err);
        }

        dispatch({
          type: SET_ACCOUNT_LABEL,
          value: {account, label},
        });

        resolve(account);
      });
    });
  };
}

export function buyEth (opts) {
  return (dispatch) => {
    const url = getBuyEthUrl(opts);
    if (global.platform) {
      global.platform.openWindow({url});
    } else {
      global.open(url);
    }
    dispatch({
      type: BUY_ETH,
    });
  };
}

export function buyEthView (address) {
  return {
    type: BUY_ETH_VIEW,
    value: address,
  };
}

export function pairUpdate (coin) {
  return (dispatch) => {
    dispatch(showSubLoadingIndication());
    dispatch(hideWarning());
    shapeShiftRequest("marketinfo", {pair: `${coin.toLowerCase()}_eth`}, (mktResponse) => {
      dispatch(hideSubLoadingIndication());
      if (mktResponse.error) {
        return dispatch(displayWarning(mktResponse.error));
      }
      dispatch({
        type: PAIR_UPDATE,
        value: {
          marketinfo: mktResponse,
        },
      });
    });
  };
}

export function shapeShiftSubview (network) {
  var pair = "btc_eth";
  return (dispatch) => {
    dispatch(showSubLoadingIndication());
    shapeShiftRequest("marketinfo", {pair}, (mktResponse) => {
      shapeShiftRequest("getcoins", {}, (response) => {
        dispatch(hideSubLoadingIndication());
        if (mktResponse.error) {
          return dispatch(displayWarning(mktResponse.error));
        }
        dispatch({
          type: SHAPESHIFT_SUBVIEW,
          value: {
            marketinfo: mktResponse,
            coinOptions: response,
          },
        });
      });
    });
  };
}

export function coinShiftRquest (data, marketData) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    shapeShiftRequest("shift", {method: "POST", data}, (response) => {
      dispatch(hideLoadingIndication());
      if (response.error) {
        return dispatch(displayWarning(response.error));
      }
      var message = `Deposit your ${response.depositType} to the address below:`;
      log.debug("background.createShapeShiftTx");
      background.createShapeShiftTx(response.deposit, response.depositType);
      dispatch(showQrView(response.deposit, [message].concat(marketData)));
    });
  };
}

export function buyWithShapeShift (data) {
  return dispatch => new Promise((resolve, reject) => {
    shapeShiftRequest("shift", {method: "POST", data}, (response) => {
      if (response.error) {
        return reject(response.error);
      }
      background.createShapeShiftTx(response.deposit, response.depositType);
      return resolve(response);
    });
  });
}

export function showQrView (data, message) {
  return {
    type: SHOW_QR_VIEW,
    value: {
      message: message,
      data: data,
    },
  };
}

export function reshowQrCode (data, coin) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    shapeShiftRequest("marketinfo", {pair: `${coin.toLowerCase()}_eth`}, (mktResponse) => {
      if (mktResponse.error) {
        return dispatch(displayWarning(mktResponse.error));
      }

      var message = [
        `Deposit your ${coin} to the address below:`,
        `Deposit Limit: ${mktResponse.limit}`,
        `Deposit Minimum: ${mktResponse.minimum}`,
      ];

      dispatch(hideLoadingIndication());
      return dispatch(showQrView(data, message));
    });
  };
}

export function shapeShiftRequest (query, options, cb) {
  var queryResponse, method;
  !options ? options = {} : null;
  options.method ? method = options.method : method = "GET";

  var requestListner = function (request) {
    try {
      queryResponse = JSON.parse(this.responseText);
      cb ? cb(queryResponse) : null;
      return queryResponse;
    } catch (e) {
      cb ? cb({error: e}) : null;
      return e;
    }
  };

  var shapShiftReq = new XMLHttpRequest();
  shapShiftReq.addEventListener("load", requestListner);
  shapShiftReq.open(method, `https://shapeshift.io/${query}/${options.pair ? options.pair : ""}`, true);

  if (options.method === "POST") {
    var jsonObj = JSON.stringify(options.data);
    shapShiftReq.setRequestHeader("Content-Type", "application/json");
    return shapShiftReq.send(jsonObj);
  } else {
    return shapShiftReq.send();
  }
}

// Call Background Then Update
//
// A function generator for a common pattern wherein:
// We show loading indication.
// We call a background method.
// We hide loading indication.
// If it errored, we show a warning.
// If it didn't, we update the state.
export function callBackgroundThenUpdateNoSpinner (method, ...args) {
  return (dispatch) => {
    method.call(background, ...args, (err) => {
      if (err) {
        return dispatch(displayWarning(err.message));
      }
      forceUpdateMetamaskState(dispatch);
    });
  };
}

export function callBackgroundThenUpdate (method, ...args) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    method.call(background, ...args, (err) => {
      dispatch(hideLoadingIndication());
      if (err) {
        return dispatch(displayWarning(err.message));
      }
      forceUpdateMetamaskState(dispatch);
    });
  };
}

export function forceUpdateMetamaskState (dispatch) {
  log.debug("background.getState");
  return new Promise((resolve, reject) => {
    background.getState((err, newState) => {
      if (err) {
        dispatch(displayWarning(err.message));
        return reject(err);
      }

      dispatch(updateMetamaskState(newState));
      resolve(newState);
    });
  });
}

export function updateCurrentLocale (key) {
  return (dispatch) => {
    dispatch(showLoadingIndication());
    dispatch(updateIntl(localization[key]));
    background.setCurrentLocale(key, (err) => {
      dispatch(hideLoadingIndication());
      if (err) {
        return dispatch(displayWarning(err.message));
      }
    });
  };
}


export const GO_HOME = "GO_HOME";
// modal state
export const MODAL_OPEN = "UI_MODAL_OPEN";
export const MODAL_CLOSE = "UI_MODAL_CLOSE";
// menu state/
export const getNetworkStatus = "getNetworkStatus";
// transition state
export const TRANSITION_FORWARD = "TRANSITION_FORWARD";
export const TRANSITION_BACKWARD = "TRANSITION_BACKWARD";
// remote state
export const UPDATE_METAMASK_STATE = "UPDATE_METAMASK_STATE";
// notices
export const MARK_NOTICE_READ = "MARK_NOTICE_READ";
export const SHOW_NOTICE = "SHOW_NOTICE";
export const CLEAR_NOTICES = "CLEAR_NOTICES";
// intialize screen
export const CREATE_NEW_VAULT_IN_PROGRESS = "CREATE_NEW_VAULT_IN_PROGRESS";
export const SHOW_CREATE_VAULT = "SHOW_CREATE_VAULT";
export const SHOW_RESTORE_VAULT = "SHOW_RESTORE_VAULT";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";
export const SHOW_INIT_MENU = "SHOW_INIT_MENU";
export const SHOW_NEW_VAULT_SEED = "SHOW_NEW_VAULT_SEED";
export const SHOW_INFO_PAGE = "SHOW_INFO_PAGE";
export const SHOW_IMPORT_PAGE = "SHOW_IMPORT_PAGE";
export const SHOW_NEW_ACCOUNT_PAGE = "SHOW_NEW_ACCOUNT_PAGE";
export const SET_NEW_ACCOUNT_FORM = "SET_NEW_ACCOUNT_FORM";
export const NEW_ACCOUNT_SCREEN = "NEW_ACCOUNT_SCREEN";
export const CLOSE_WELCOME_SCREEN = "CLOSE_WELCOME_SCREEN";
// unlock screen
export const UNLOCK_IN_PROGRESS = "UNLOCK_IN_PROGRESS";
export const UNLOCK_FAILED = "UNLOCK_FAILED";
export const UNLOCK_SUCCEEDED = "UNLOCK_SUCCEEDED";
export const UNLOCK_METAMASK = "UNLOCK_METAMASK";
export const LOCK_METAMASK = "LOCK_METAMASK";
// error handling
export const DISPLAY_WARNING = "DISPLAY_WARNING";
export const HIDE_WARNING = "HIDE_WARNING";
// accounts screen
export const SET_SELECTED_ACCOUNT = "SET_SELECTED_ACCOUNT";
export const SET_SELECTED_TOKEN_ADDRESS = "SET_SELECTED_TOKEN_ADDRESS";
export const SHOW_ACCOUNT_DETAIL = "SHOW_ACCOUNT_DETAIL";
export const SHOW_ACCOUNTS_PAGE = "SHOW_ACCOUNTS_PAGE";
export const SHOW_CONF_TX_PAGE = "SHOW_CONF_TX_PAGE";
export const SHOW_CONF_MSG_PAGE = "SHOW_CONF_MSG_PAGE";
export const SET_CURRENT_FIAT = "SET_CURRENT_FIAT";
// account detail screen
export const SHOW_SEND_PAGE = "SHOW_SEND_PAGE";
export const SHOW_SEND_TOKEN_PAGE = "SHOW_SEND_TOKEN_PAGE";
export const ADD_TO_ADDRESS_BOOK = "ADD_TO_ADDRESS_BOOK";
export const REQUEST_ACCOUNT_EXPORT = "REQUEST_ACCOUNT_EXPORT";
export const EXPORT_ACCOUNT = "EXPORT_ACCOUNT";
export const SHOW_PRIVATE_KEY = "SHOW_PRIVATE_KEY";
export const SET_ACCOUNT_LABEL = "SET_ACCOUNT_LABEL";
// tx conf screen
export const COMPLETED_TX = "COMPLETED_TX";
export const TRANSACTION_ERROR = "TRANSACTION_ERROR";
export const UPDATE_TRANSACTION_PARAMS = "UPDATE_TRANSACTION_PARAMS";
// send screen
export const UPDATE_TOKEN_BALANCE = "UPDATE_TOKEN_BALANCE";
export const UPDATE_MAX_MODE = "UPDATE_MAX_MODE";
export const UPDATE_SEND = "UPDATE_SEND";
export const CLEAR_SEND = "CLEAR_SEND";
export const GAS_LOADING_STARTED = "GAS_LOADING_STARTED";
export const GAS_LOADING_FINISHED = "GAS_LOADING_FINISHED";
export const BACK_TO_ACCOUNT_DETAIL = "BACK_TO_ACCOUNT_DETAIL";
// config screen
export const SHOW_CONFIG_PAGE = "SHOW_CONFIG_PAGE";
export const SET_RPC_TARGET = "SET_RPC_TARGET";
export const SET_PROVIDER_TYPE = "SET_PROVIDER_TYPE";
export const SHOW_ADD_TOKEN_PAGE = "SHOW_ADD_TOKEN_PAGE";
export const UPDATE_TOKENS = "UPDATE_TOKENS";
// loading overlay
export const SHOW_LOADING = "SHOW_LOADING_INDICATION";
export const HIDE_LOADING = "HIDE_LOADING_INDICATION";
// buy Eth with coinbase
export const ONBOARDING_BUY_ETH_VIEW = "ONBOARDING_BUY_ETH_VIEW";
export const BUY_ETH = "BUY_ETH";
export const BUY_ETH_VIEW = "BUY_ETH_VIEW";
export const COINBASE_SUBVIEW = "COINBASE_SUBVIEW";
export const SHAPESHIFT_SUBVIEW = "SHAPESHIFT_SUBVIEW";
export const PAIR_UPDATE = "PAIR_UPDATE";
export const SHOW_SUB_LOADING_INDICATION = "SHOW_SUB_LOADING_INDICATION";
export const HIDE_SUB_LOADING_INDICATION = "HIDE_SUB_LOADING_INDICATION";
// QR STUFF:
export const SHOW_QR = "SHOW_QR";
export const SHOW_QR_VIEW = "SHOW_QR_VIEW";
// FORGOT PASSWORD:
export const BACK_TO_INIT_MENU = "BACK_TO_INIT_MENU";
export const RECOVERY_IN_PROGRESS = "RECOVERY_IN_PROGRESS";
export const BACK_TO_UNLOCK_VIEW = "BACK_TO_UNLOCK_VIEW";
// SHOWING KEYCHAIN
export const TOGGLE_ACCOUNT_MENU = "TOGGLE_ACCOUNT_MENU";
//
export const USE_ETHERSCAN_PROVIDER = "USE_ETHERSCAN_PROVIDER";
export const REVEAL_ACCOUNT = "REVEAL_ACCOUNT";
export const CLEAR_SEED_WORD_CACHE = "CLEAR_SEED_WORD_CACHE";
export const SET_RPC_LIST = "SET_RPC_LIST";
