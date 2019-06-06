import React, {Component} from "react";
import {Button, ButtonGroup, ButtonToolbar, Col, Panel, Row} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import EthBalance from "./eth";
import PlatBalance from "./plat";
import {SEND_ROUTE} from "../../../../routes";
import PropTypes from "prop-types";
import {getTokenBySymbol} from "./token";


export default class Balance extends Component {

  static propTypes = {
    history: PropTypes.object,
    showModal: PropTypes.func,
    setSelectedToken: PropTypes.func,
  };

  onPLATDeposit () {
    alert("not implemented");
  }

  onPLATSend () {
    const {history, setSelectedToken} = this.props;
    setSelectedToken(getTokenBySymbol("PLAT"));
    history.push(SEND_ROUTE);
  }

  onETHDeposit () {
    const {showModal} = this.props;
    showModal({
      name: "DEPOSIT_ETHER",
    });
  }

  onETHSend () {
    const {history, setSelectedToken} = this.props;
    setSelectedToken();
    history.push(SEND_ROUTE);
  }

  render () {
    return (
      <Row className="half-gutter balance">
        <Col xs={6}>
          <Panel>
            <PlatBalance/>
            <ButtonToolbar>
              <ButtonGroup>
                <Button bsStyle="success" onClick={::this.onPLATSend}>
                  <FormattedMessage id="buttons.send"/>
                </Button>
                <Button bsStyle="primary" onClick={::this.onPLATDeposit}>
                  <FormattedMessage id="buttons.buy"/>
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Panel>
        </Col>
        <Col xs={6}>
          <Panel>
            <EthBalance/>
            <ButtonToolbar>
              <ButtonGroup>
                <Button bsStyle="success" onClick={::this.onETHSend}>
                  <FormattedMessage id="buttons.send"/>
                </Button>
                <Button bsStyle="primary" onClick={::this.onETHDeposit}>
                  <FormattedMessage id="buttons.buy"/>
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Panel>
        </Col>
      </Row>
    );
  }
}
