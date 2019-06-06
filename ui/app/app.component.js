import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import {Route, Switch} from "react-router-dom";
import Initialize from "../../mascara/src/app/first-time";
import SendTransaction from "./components/pages/send";
import ConfirmTx from "./components/pages/transaction/index";
import Authenticated from "./components/pages/authenticated";
import Initialized from "./components/pages/initialized";
import Settings from "./components/pages/settings";
import Rpc from "./components/pages/rpc";
import UnlockPage from "./components/pages/unlock-page";
import RestoreVaultPage from "./components/pages/keychains/restore-vault";
import RevealSeedConfirmation from "./components/pages/keychains/reveal-seed";
import AddTokenPage from "./components/pages/add-token";
import Account from "./components/pages/account";
import Notice from "./components/pages/notice";
import Home from "./components/pages/home";
import Header from "./components/pages/header";
import SelectNetwork from "./components/pages/select/network";
import SelectAccount from "./components/pages/select/account";
import NoMatch from "./components/pages/not-found";


import Loading from "./components/loading-screen";
// Global Modals
import Modal from "./components/modals";
// Routes
import {
  ACCOUNT_ROUTE,
  ADD_TOKEN_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  DEFAULT_ROUTE,
  INITIALIZE_ROUTE,
  NOTICE_ROUTE,
  RESTORE_VAULT_ROUTE,
  REVEAL_SEED_ROUTE,
  RPC_ROUTE,
  SELECT_ACCOUNT_ROUTE,
  SELECT_NETWORK_ROUTE,
  SEND_ROUTE,
  SETTINGS_ROUTE,
  UNLOCK_ROUTE,
} from "./routes";
import {getNetworkDisplayName} from "../../app/scripts/controllers/network/util";


export default class App extends Component {

  static propTypes = {
    currentCurrency: PropTypes.string,
    setCurrentCurrencyToUSD: PropTypes.func,
    isLoading: PropTypes.bool,
    loadingMessage: PropTypes.string,
    network: PropTypes.string,
    provider: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
  };

  componentWillMount () {
    const {currentCurrency, setCurrentCurrencyToUSD} = this.props;

    if (!currentCurrency) {
      setCurrentCurrencyToUSD();
    }
  }

  renderRoutes () {
    return (
      <Switch>
        <Route path={INITIALIZE_ROUTE} component={Initialize} />
        <Initialized exact path={UNLOCK_ROUTE} component={UnlockPage} />
        <Initialized exact path={RESTORE_VAULT_ROUTE} component={RestoreVaultPage} />
        <Authenticated exact path={REVEAL_SEED_ROUTE} component={RevealSeedConfirmation} />
        <Authenticated path={RPC_ROUTE} component={Rpc} />
        <Authenticated path={SETTINGS_ROUTE} component={Settings} />
        <Authenticated exact path={NOTICE_ROUTE} component={Notice} />
        <Authenticated path={`${CONFIRM_TRANSACTION_ROUTE}/:id?`} component={ConfirmTx} />
        <Authenticated exact path={SEND_ROUTE} component={SendTransaction} />
        <Authenticated exact path={ADD_TOKEN_ROUTE} component={AddTokenPage} />
        <Authenticated exact path={SELECT_NETWORK_ROUTE} component={SelectNetwork} />
        <Authenticated exact path={SELECT_ACCOUNT_ROUTE} component={SelectAccount} />
        <Authenticated path={ACCOUNT_ROUTE} component={Account} />
        <Authenticated exact path={DEFAULT_ROUTE} component={Home} />
        <Route component={NoMatch} />
      </Switch>
    );
  }

  renderLoading () {
    const {
      isLoading,
      loadingMessage,
      network,
    } = this.props;

    if (loadingMessage) {
      return (
        <Loading loadingMessage={loadingMessage} />
      );
    }

    const isLoadingNetwork = network === "loading";
    const networkName = getNetworkDisplayName(network);

    if (isLoading || isLoadingNetwork) {
      return (
        <Loading loadingMessage="connecting" values={{name: networkName}} />
      );
    }

    return null;
  }

  render () {
    return (
      <Fragment>
        <Modal />
        <Header />
        {this.renderLoading()}
        {this.renderRoutes()}
      </Fragment>
    );
  }
}
