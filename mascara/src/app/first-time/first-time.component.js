import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";
import CreatePassword from "./create-password";
import UniqueImage from "./unique-image";
import Notice from "./notice";
import BackupPhrase from "./backup-seed";
import SeedPhrase from "./seed-phrase";
import ConfirmSeed from "./confirm-seed";
import Welcome from "./welcome";
import {
  INITIALIZE_BACKUP_PHRASE_ROUTE,
  INITIALIZE_CONFIRM_SEED_ROUTE,
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_ROUTE,
  INITIALIZE_NOTICE_ROUTE,
  INITIALIZE_ROUTE,
  INITIALIZE_UNIQUE_IMAGE_ROUTE,
} from "../../../../ui/app/routes";
import {Grid} from "react-bootstrap";


export default class FirstTimeFlow extends Component {
  render () {
    return (
      <Grid className="first-time-flow">
        <Switch>
          <Route exact path={INITIALIZE_IMPORT_ROUTE} component={SeedPhrase} />
          <Route exact path={INITIALIZE_UNIQUE_IMAGE_ROUTE} component={UniqueImage} />
          <Route exact path={INITIALIZE_NOTICE_ROUTE} component={Notice} />
          <Route exact path={INITIALIZE_BACKUP_PHRASE_ROUTE} component={BackupPhrase} />
          <Route exact path={INITIALIZE_CONFIRM_SEED_ROUTE} component={ConfirmSeed} />
          <Route exact path={INITIALIZE_CREATE_PASSWORD_ROUTE} component={CreatePassword} />
          <Route exact path={INITIALIZE_ROUTE} component={Welcome} />
        </Switch>
      </Grid>
    );
  }
}
