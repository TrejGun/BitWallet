import React, {Component} from "react";
import {Col, Grid, Nav, NavItem, Row, Tab} from "react-bootstrap";
import Settings from "./settings";
import Info from "./info";
import {FormattedMessage} from "react-intl";


export default class SettingsTabs extends Component {
  render () {
    return (
      <Grid className="page">
        <div className="page__title">
          <FormattedMessage id="pages.settings.title" />
        </div>
        <Tab.Container defaultActiveKey="settings" id="import-tabs">
          <Row className="clearfix">
            <Col sm={12}>
              <Nav bsStyle="tabs">
                <NavItem eventKey="settings">
                  <FormattedMessage id="pages.settings.tabs.settings.title" />
                </NavItem>
                <NavItem eventKey="info">
                  <FormattedMessage id="pages.settings.tabs.info.title" />
                </NavItem>
              </Nav>
            </Col>
            <Col sm={12}>
              <Tab.Content>
                <Tab.Pane eventKey="settings">
                  <Settings />
                </Tab.Pane>
                <Tab.Pane eventKey="info">
                  <Info />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Grid>
    );
  }
}
