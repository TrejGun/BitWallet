import React, {Component} from "react";
import PropTypes from "prop-types";
import copyToClipboard from "copy-to-clipboard";
import {FormattedMessage} from "react-intl";
import {Tooltip, OverlayTrigger} from "react-bootstrap";


export default class Copyable extends Component {
  static propTypes = {
    children: PropTypes.element,
    value: PropTypes.string,
    placement: PropTypes.string,
  };

  static defaultProps = {
    placement: "bottom",
  };

  state = {
    isCopied: false,
  };

  onClick (e) {
    const {value} = this.props;
    e.preventDefault();
    e.stopPropagation();
    copyToClipboard(value);
    this.debounceRestore();
  }

  renderTooltip () {
    const {isCopied} = this.state;

    return (
      <Tooltip id="tooltip">
        {isCopied
          ? <FormattedMessage id="components.copyable.copiedExclamation"/>
          : <FormattedMessage id="components.copyable.copyToClipboard"/>
        }
      </Tooltip>
    );
  }

  render () {
    const {children, placement} = this.props;
    const {isCopied} = this.state;

    return (
      <OverlayTrigger placement={placement} overlay={this.renderTooltip()}>
        {React.cloneElement(children, {onClick: ::this.onClick, "data-copied": isCopied})}
      </OverlayTrigger>
    );
  }

  debounceRestore () {
    this.setState({copied: true});
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({copied: false});
    }, 850);
  }
}
