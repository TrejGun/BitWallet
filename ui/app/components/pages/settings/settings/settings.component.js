import React, {Component} from "react";
import PropTypes from "prop-types";
import Locale from "./locale";
import Reset from "./reset";
import Seed from "./seed";
import Currency from "./currency";
import Logs from "./logs";


export default class Settings extends Component {

  static propTypes = {
    warning: PropTypes.string,
  };

  renderWarnings () {
    const {warning} = this.props;
    if (warning) {
      return (
        <div className="settings__error">
          {warning}
        </div>
      );
    }

    return null;
  }

  render () {
    return (
      <div className="settings">
        {this.renderWarnings()}
        <Currency/>
        <Locale/>
        <Logs/>
        <Seed/>
        <Reset/>
      </div>
    );
  }
}
