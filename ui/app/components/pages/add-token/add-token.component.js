import React, {Component} from "react";
import {FormattedMessage} from "react-intl";
import {Col, Grid, Nav, NavItem, Row, Tab} from "react-bootstrap";
import Search from "./search";
import Custom from "./custom";
import Autoload from "./autoload";
import PropTypes from "prop-types";


function getActiveKey (props) {
  return props.provider.type === "mainnet" ? "autoload" : "custom";
}

export default class AddToken extends Component {

  static propTypes = {
    provider: PropTypes.object,
  };

  state = {
    activeKey: getActiveKey(this.props),
  };

  componentWillReceiveProps (nextProps) {
    this.setState({
      activeKey: getActiveKey(nextProps),
    });
  }

  onSelect (activeKey) {
    this.setState({activeKey});
  }

  render () {
    const {provider} = this.props;
    const {activeKey} = this.state;

    return (
      <Grid className="page add-token">
        <div className="page__title">
          <FormattedMessage id="pages.addTokens.title" />
        </div>
        <Tab.Container activeKey={activeKey} onSelect={::this.onSelect} id="add-token-tabs">
          <Row className="clearfix">
            <Col sm={12}>
              <Nav bsStyle="tabs">
                <NavItem eventKey="autoload" disabled={provider.type !== "mainnet"}>
                  <FormattedMessage id="pages.addTokens.tabs.autoload.title" />
                </NavItem>
                <NavItem eventKey="search" disabled={provider.type !== "mainnet"}>
                  <FormattedMessage id="pages.addTokens.tabs.search.title" />
                </NavItem>
                <NavItem eventKey="custom">
                  <FormattedMessage id="pages.addTokens.tabs.custom.title" />
                </NavItem>
              </Nav>
            </Col>
            <Col sm={12}>
              <Tab.Content>
                <Tab.Pane eventKey="autoload">
                  <Autoload />
                </Tab.Pane>
                <Tab.Pane eventKey="custom">
                  <Custom />
                </Tab.Pane>
                <Tab.Pane eventKey="search">
                  <Search />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Grid>
    );
  }
}
