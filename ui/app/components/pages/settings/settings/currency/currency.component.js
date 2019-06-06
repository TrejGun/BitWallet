import React, {Component} from "react";
import PropTypes from "prop-types";
import infuraCurrencies from "../../../../../infura-conversion.json";
import {Dropdown, MenuItem} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


function getInfuraCurrency () {
  return infuraCurrencies.objects.sort((a, b) => {
    return a.quote.name.toLocaleLowerCase().localeCompare(b.quote.name.toLocaleLowerCase());
  }).map(({quote: {code, name}}) => {
    return {
      displayValue: `${code.toUpperCase()} - ${name}`,
      key: code,
    };
  });
}


export default class Currency extends Component {

  static propTypes = {
    currentCurrency: PropTypes.string,
    conversionDate: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    setCurrentCurrency: PropTypes.func,
  };

  onSelect (eventKey) {
    const {setCurrentCurrency} = this.props;
    setCurrentCurrency(eventKey);
  }

  render () {
    const {currentCurrency, conversionDate} = this.props;
    const currencies = getInfuraCurrency();

    return (
      <div className="settings__content-row">
        <div className="settings__content-item">
          <h4>
            <FormattedMessage id="pages.settings.tabs.settings.currency.title"/>
          </h4>
          <span className="settings__content-description">
            <FormattedMessage id="pages.settings.tabs.settings.currency.description" values={{date: Date(conversionDate)}}/>
          </span>
        </div>
        <Dropdown id="lang-dropdown">
          <Dropdown.Toggle>
            {currencies.find(currency => currency.key === currentCurrency.toLowerCase()).displayValue}
          </Dropdown.Toggle>
          <Dropdown.Menu onSelect={::this.onSelect}>
            {currencies.map((currency, i) => {
              return (
                <MenuItem eventKey={currency.key} key={currency.key} active={currency.key === currentCurrency.toLowerCase()}>
                  {currency.displayValue}
                </MenuItem>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}
