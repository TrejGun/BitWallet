import React, {Component} from "react";
import {Col, Row} from "react-bootstrap";
import PropTypes from "prop-types";
import {DETAIL_ACCOUNT_ROUTE} from "../../../../routes";
import {Link} from "react-router-dom";
import CopyButton from "../../../buttons/copy";


export default class Receive extends Component {

  static propTypes = {
    selectedAddress: PropTypes.string,
  };

  render () {
    const {selectedAddress} = this.props;

    return (
      <Row className="wide receive">
        <Col xs={6}>
          <Link to={DETAIL_ACCOUNT_ROUTE.replace(":address", selectedAddress)}>
            RECEIVE FUNDS
          </Link>
        </Col>
        <Col xs={6}>
          <CopyButton selectedAddress={selectedAddress}/>
        </Col>
      </Row>
    );
  }
}
