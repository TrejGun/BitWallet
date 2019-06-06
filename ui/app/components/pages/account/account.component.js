import React, {Component} from "react";
import {Switch, Route} from "react-router-dom";
import {CREATE_ACCOUNT_ROUTE, EXPORT_ACCOUNT_ROUTE, IMPORT_ACCOUNT_ROUTE, DETAIL_ACCOUNT_ROUTE} from "../../../routes";
import CreateAccount from "./create";
import ImportAccount from "./import";
import AccountDetails from "./details";
import ExportAccount from "./export";


export default class Account extends Component {
  render () {
    return (
      <Switch>
        <Route path={CREATE_ACCOUNT_ROUTE} component={CreateAccount}/>
        <Route path={IMPORT_ACCOUNT_ROUTE} component={ImportAccount}/>
        <Route path={EXPORT_ACCOUNT_ROUTE} component={ExportAccount}/>
        <Route path={DETAIL_ACCOUNT_ROUTE} component={AccountDetails}/>
      </Switch>
    );
  }
}
