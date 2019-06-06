import React, {Component} from "react";
import {Col, Grid, Nav, NavItem, Row, Tab} from "react-bootstrap";
import PrivateKey from "./private-key";
import JsonFile from "./json-file";
import {FormattedMessage} from "react-intl";


export default class ImportTabs extends Component {
  render () {
    return (
      <Grid className="page import-account">
        <div className="page__title">
          <FormattedMessage id="pages.account.import.title" />
        </div>
        <Tab.Container defaultActiveKey="privateKey" id="import-tabs">
          <Row className="clearfix">
            <Col sm={12}>
              <Nav bsStyle="tabs">
                <NavItem eventKey="privateKey">
                  <FormattedMessage id="pages.account.import.tabs.privateKey.title" />
                </NavItem>
                <NavItem eventKey="jsonFile">
                  <FormattedMessage id="pages.account.import.tabs.jsonFile.title" />
                </NavItem>
              </Nav>
            </Col>
            <Col sm={12}>
              <Tab.Content>
                <Tab.Pane eventKey="privateKey">
                  <PrivateKey />
                </Tab.Pane>
                <Tab.Pane eventKey="jsonFile">
                  <JsonFile />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Grid>
    );
  }
}
