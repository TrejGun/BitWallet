import React, {Component} from "react";
import PropTypes from "prop-types";
import Markdown from "react-markdown";
import {debounce} from "lodash";
import {INITIALIZE_BACKUP_PHRASE_ROUTE} from "../../../../../ui/app/routes";
import {Button, ButtonToolbar} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


export default class NoticeComponent extends Component {
  static propTypes = {
    nextUnreadNotice: PropTypes.shape({
      title: PropTypes.string,
      date: PropTypes.string,
      body: PropTypes.string,
    }),
    location: PropTypes.shape({
      state: PropTypes.shape({
        next: PropTypes.func.isRequired,
      }),
    }),
    markNoticeRead: PropTypes.func,
    history: PropTypes.object,
    noActiveNotices: PropTypes.bool,
  };

  static defaultProps = {
    nextUnreadNotice: {},
  };

  state = {
    atBottom: false,
  };

  componentDidMount () {
    const {noActiveNotices, history} = this.props;

    if (noActiveNotices) {
      history.push(INITIALIZE_BACKUP_PHRASE_ROUTE);
    }

    this.onScroll();
  }

  onClickNext () {
    const {markNoticeRead, nextUnreadNotice, history} = this.props;
    const {atBottom} = this.state;

    if (!atBottom) {
      return;
    }

    markNoticeRead(nextUnreadNotice)
      .then(hasActiveNotices => {
        if (!hasActiveNotices) {
          history.push(INITIALIZE_BACKUP_PHRASE_ROUTE);
        } else {
          this.setState({atBottom: false});
          this.onScroll();
        }
      });
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
    const {
      nextUnreadNotice: {title, body},
    } = this.props;
    const {atBottom} = this.state;

    return (
      <div className="tou" onScroll={this.onScroll}>
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
            onClick={::this.onClickNext}
            disabled={!atBottom}
          >
            <FormattedMessage id="buttons.accept"/>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}
