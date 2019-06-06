import React, {Component} from "react";
import PropTypes from "prop-types";
import {Dropdown, MenuItem} from "react-bootstrap";
import {FormattedMessage, intlShape} from "react-intl";
import {enabledLanguages} from "../../../../../localization/constants";


export default class Locale extends Component {

  static propTypes = {
    updateCurrentLocale: PropTypes.func,
    intl: intlShape,
  };

  onSelect (eventKey) {
    const {updateCurrentLocale} = this.props;
    updateCurrentLocale(eventKey);
  }

  render () {
    const {intl} = this.props;

    return (
      <div className="settings__content-row">
        <div className="settings__content-item">
          <h4>
            <FormattedMessage id="pages.settings.tabs.settings.locale.title"/>
          </h4>
        </div>
        <Dropdown id="lang-dropdown">
          <Dropdown.Toggle>
            <FormattedMessage id={`app.language.${intl.locale}`}/>
          </Dropdown.Toggle>
          <Dropdown.Menu onSelect={::this.onSelect}>
            {enabledLanguages.map(lang => {
              return (
                <MenuItem eventKey={lang} key={lang} active={lang === intl.locale}>
                  <FormattedMessage id={`app.language.${lang}`}/>
                </MenuItem>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}
