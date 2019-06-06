import React, {Component} from "react";
import PropTypes from "prop-types";
import Spinner from "./spinner";
import {FormattedMessage} from "react-intl";


export default class Loading extends Component {

  static propTypes = {
    loadingMessage: PropTypes.string,
    values: PropTypes.object,
  };

  static defaultProps = {
    loadingMessage: "default",
  };

  render () {
    const {
      loadingMessage,
      values,
    } = this.props;

    return (
      <div className="loading-screen">
        <Spinner color="#1B344D" />
        <div className="loading-screen__message">
          <FormattedMessage
            id={`components.loading.${loadingMessage}`}
            defaultMessage={loadingMessage}
            values={values}
          />
        </div>
      </div>
    );
  }
}

