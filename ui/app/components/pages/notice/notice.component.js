import React, {Component} from "react";
import PropTypes from "prop-types";
import Markdown from "react-markdown";
import {DEFAULT_ROUTE} from "../../../routes";
import {Button, ButtonToolbar, Grid} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import {debounce} from "lodash";


export default class Notice extends Component {

  static propTypes = {
    notice: PropTypes.object,
    onConfirm: PropTypes.func,
    history: PropTypes.object,
  };

  state = {
    atBottom: false,
  };

  componentWillMount () {
    const {notice, history} = this.props;
    if (!notice) {
      history.push(DEFAULT_ROUTE);
    }
  }

  componentWillReceiveProps (nextProps) {
    const {history} = this.props;
    if (!nextProps.notice) {
      history.push(DEFAULT_ROUTE);
    }
  }

  handleAccept () {
    const {onConfirm} = this.props;
    this.setState({disclaimerDisabled: true});
    onConfirm();
  }

  onScroll = debounce(() => {
    const {atBottom} = this.state;

    if (atBottom) {
      return;
    }

    const target = document.querySelector(".markdown");
    const {scrollTop, offsetHeight, scrollHeight} = target;

    this.setState({
      atBottom: scrollTop + offsetHeight >= scrollHeight,
    });
  }, 25);

  render () {
    const {notice: {title, body} = {}} = this.props;
    const {atBottom} = this.state;

    return (
      <Grid onScroll={this.onScroll}>
        <div className="first-time-flow__title">
          {title}
        </div>
        <Markdown
          className="markdown"
          source={body}
          skipHtml
        />
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            onClick={::this.handleAccept}
            disabled={!atBottom}
          >
            <FormattedMessage id="buttons.accept" />
          </Button>
        </ButtonToolbar>
      </Grid>
    );
  }
}
