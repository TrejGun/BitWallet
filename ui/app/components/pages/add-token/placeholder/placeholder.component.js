import React, {Component} from "react";
import {FormattedMessage} from "react-intl";
import {Image} from "react-bootstrap";


export default class TokenListPlaceholder extends Component {
  render () {
    return (
      <div className="token-list-placeholder">
        <Image src="/app/images/tokensearch.svg"/>
        <div className="token-list-placeholder__text">
          <FormattedMessage id="pages.addTokens.placeholder.addAcquiredTokens"/>
        </div>
        <a
          className="token-list-placeholder__link"
          href="https://consensys.zendesk.com/hc/en-us/articles/360004135092"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FormattedMessage id="pages.addTokens.placeholder.learnMore"/>
        </a>
      </div>
    );
  }
}
