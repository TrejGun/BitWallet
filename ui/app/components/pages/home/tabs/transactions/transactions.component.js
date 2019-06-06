import React, {Component, Fragment} from "react";
import {Col, Grid, ListGroup, Row, Image} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import TransactionListItem from "./transaction";
import PropTypes from "prop-types";
import {tokenInfoGetter} from "../../../../../token-util";


export default class Transactions extends Component {

  static propTypes = {
    txsToRender: PropTypes.array,
    eventKey: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  };

  componentWillMount () {
    this.tokenInfoGetter = tokenInfoGetter();
  }

  renderTransactionList () {
    const {txsToRender} = this.props;
    return (
      <ListGroup className="transactions">
        {txsToRender.map(::this.renderTransactionListItem)}
      </ListGroup>
    );
  }

  renderTransactionListItem (transaction, i) {
    return (
      <TransactionListItem
        key={i}
        transaction={transaction}
        tokenInfoGetter={this.tokenInfoGetter}
      />
    );
  }

  render () {
    const {txsToRender} = this.props;

    if (!txsToRender.length) {
      return (
        <div>
          <FormattedMessage id="components.transaction.list.noTransactions" />
        </div>
      );
    }

    return (
      <Fragment>
        <Grid className="caption">
          <Row>
            <Col xs={6}>
              {/* here be dragons */}
            </Col>
            <Col xs={3}>
              <Image src="/app/images/in.png" width={16} height={16} />
            </Col>
            <Col xs={3}>
              <Image src="/app/images/out.png" width={16} height={16} />
            </Col>
          </Row>
        </Grid>
        {this.renderTransactionList()}
      </Fragment>
    );
  }
}
