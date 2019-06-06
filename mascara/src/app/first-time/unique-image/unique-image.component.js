import React, {Component} from "react";
import PropTypes from "prop-types";
import Identicon from "../../../../../ui/app/components/identicon/index";
import {INITIALIZE_NOTICE_ROUTE} from "../../../../../ui/app/routes";
import {FormattedMessage} from "react-intl";
import {Button, ButtonToolbar} from "react-bootstrap";


export default class UniqueImageScreenComponent extends Component {
  static propTypes = {
    address: PropTypes.string,
    history: PropTypes.object,
  };

  onClickNext () {
    const {history} = this.props;
    history.push(INITIALIZE_NOTICE_ROUTE);
  }

  render () {
    const {address} = this.props;

    return (
      <div className="unique-image">
        <div className="first-time-flow__title">
          <FormattedMessage id="pages.uniqueImage.title"/>
        </div>
        <Identicon address={address} diameter={70}/>
        <div className="first-time-flow__description">
          <FormattedMessage id="pages.uniqueImage.p1"/>
        </div>
        <div className="first-time-flow__description">
          <FormattedMessage id="pages.uniqueImage.p2"/>
        </div>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            onClick={::this.onClickNext}
          >
            <FormattedMessage id="buttons.next"/>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}
