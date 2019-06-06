import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import ethUtil from "ethereumjs-util";
import {checkExistingAddresses} from "../util";
import {tokenInfoGetter} from "../../../../token-util";
import Input from "../../../input/input.group.validation";
import {FormattedMessage, intlShape} from "react-intl";
import {Button, ButtonToolbar} from "react-bootstrap";
import {DEFAULT_ROUTE} from "../../../../routes";
import {ZERO_ADDRESS} from "../../../../../../app/scripts/lib/constants";


export default class AddToken extends Component {

  static propTypes = {
    history: PropTypes.object,
    addTokens: PropTypes.func,
    isValid: PropTypes.func,
    getValidation: PropTypes.func,
    tokens: PropTypes.array,
    identities: PropTypes.object,
    formData: PropTypes.shape({
      customAddress: PropTypes.string,
      customSymbol: PropTypes.string,
      customDecimals: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    }),
    onChange: PropTypes.func,
    setState: PropTypes.func,
    validations: PropTypes.array,
    addValidationMessage: PropTypes.func,
    delValidationMessage: PropTypes.func,
    intl: intlShape,
  };

  componentDidMount () {
    this.tokenInfoGetter = tokenInfoGetter();
  }

  async attemptToAutoFillTokenParams (address) {
    const {setState} = this.props;
    const {symbol = "", decimals = ""} = await this.tokenInfoGetter(address);

    setState({
      customSymbol: symbol,
      customDecimals: decimals,
    });
  }

  handleTokenChange (e) {
    const customAddress = e.target.value;
    const {onChange, setState, identities, tokens, addValidationMessage, delValidationMessage, intl, getValidation} = this.props;

    const isValidAddress = ethUtil.isValidAddress(customAddress);
    const standardAddress = ethUtil.addHexPrefix(customAddress).toLowerCase();

    delValidationMessage(getValidation("searchToken", "required"));
    delValidationMessage(getValidation("customSymbol"));
    delValidationMessage(getValidation("customDecimals"));

    switch (true) {
      case (customAddress && !isValidAddress):
        addValidationMessage({
          name: "customAddress",
          reason: "invalid",
        });

        setState({
          symbol: "",
          decimals: "",
        });
        break;
      case Boolean(identities[standardAddress]):
        addValidationMessage({
          name: "customAddress",
          reason: "personal",
        });

        break;
      case checkExistingAddresses(customAddress, tokens):
        this.setState({
          customAddressError: intl.formatMessage({
            id: "pages.addTokens.custom.tokenAlreadyAdded",
          }),
        });

        addValidationMessage({
          name: "customAddress",
          reason: "already",
        });

        break;
      default:
        if (customAddress && customAddress !== ZERO_ADDRESS) {
          this.attemptToAutoFillTokenParams(customAddress);
        }
    }

    onChange(e);
  }

  isValid () {
    const {isValid, formData: {customAddress, customSymbol, customDecimals}} = this.props;

    if (!customAddress || !customSymbol || !customDecimals) {
      return false;
    }

    return isValid();
  }

  onNext () {
    const {
      addTokens,
      history,
      formData: {
        customAddress: address,
        customSymbol: symbol,
        customDecimals: decimals,
      },
    } = this.props;

    addTokens({
      [address]: {
        address,
        symbol,
        decimals,
      },
    })
      .then(() => {
        history.push(DEFAULT_ROUTE);
      });
  }

  render () {
    const {formData: {customAddress, customSymbol = "", customDecimals = ""}} = this.props;

    return (
      <Fragment>
        <Input
          name="customAddress"
          defaultValue={customAddress}
          onChange={::this.handleTokenChange}
        />
        <Input
          name="customSymbol"
          value={customSymbol}
          readOnly
        />
        <Input
          name="customDecimals"
          value={customDecimals}
          readOnly
        />
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            onClick={::this.onNext}
            disabled={!this.isValid()}
          >
            <FormattedMessage id="buttons.next" />
          </Button>
        </ButtonToolbar>
      </Fragment>
    );
  }
}
