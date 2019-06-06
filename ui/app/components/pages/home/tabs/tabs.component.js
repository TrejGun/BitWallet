import React, {Component} from "react";
import {Col, Nav, NavItem, Row, Tab} from "react-bootstrap";
import Transactions from "./transactions";
import Tokens from "./tokens";
import Assets from "./assets";
import {FormattedMessage} from "react-intl";


export default class HomeTabs extends Component {
  render () {
    return (
      <Tab.Container defaultActiveKey="transactions" id="data-tabs">
        <Row className="clearfix">
          <Col sm={12}>
            <Nav bsStyle="tabs">
              <NavItem eventKey="transactions">
                <FormattedMessage id="pages.home.tabs.transactions.title"/>
              </NavItem>
              <NavItem eventKey="tokens">
                <FormattedMessage id="pages.home.tabs.tokens.title"/>
              </NavItem>
              <NavItem eventKey="assets">
                <FormattedMessage id="pages.home.tabs.assets.title"/>
              </NavItem>
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content>
              <Tab.Pane eventKey="transactions">
                <Transactions/>
              </Tab.Pane>
              <Tab.Pane eventKey="tokens">
                <Tokens/>
              </Tab.Pane>
              <Tab.Pane eventKey="assets">
                <Assets/>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  }
}
