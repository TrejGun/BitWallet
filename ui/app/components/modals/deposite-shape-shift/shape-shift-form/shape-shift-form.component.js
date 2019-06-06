import React, {Component} from "react";
import classnames from "classnames";
import {qrcode} from "qrcode-npm";
import {isValidAddress} from "../../../../util";
import PropTypes from "prop-types";
import {intlShape, FormattedMessage} from "react-intl";
import {DropdownButton, MenuItem} from "react-bootstrap";


export default class ShapeShiftForm extends Component {

  static propTypes = {
    shapeShiftSubview: PropTypes.func,
    pairUpdate: PropTypes.func,
    selectedAddress: PropTypes.string,
    buyWithShapeShift: PropTypes.func,
    tokenExchangeRates: PropTypes.object,
    coinOptions: PropTypes.object,
    btnClass: PropTypes.func,
    warning: PropTypes.func,
    intl: intlShape,
  };

  state = {
    depositCoin: "btc",
    refundAddress: "",
    showQrCode: false,
    depositAddress: "",
    errorMessage: "",
    isLoading: false,
    bought: false,
  };

  getCoinPair () {
    return `${this.state.depositCoin.toUpperCase()}_ETH`;
  }

  componentWillMount () {
    const {shapeShiftSubview} = this.props;
    shapeShiftSubview();
  }

  onCoinChange (eventKey) {
    const {pairUpdate} = this.props;
    this.setState({
      depositCoin: eventKey,
      errorMessage: "",
    });
    pairUpdate(eventKey);
  }

  onBuyWithShapeShift () {
    this.setState({
      isLoading: true,
      showQrCode: true,
    });

    const {
      buyWithShapeShift,
      selectedAddress: withdrawal,
    } = this.props;
    const {
      refundAddress: returnAddress,
      depositCoin,
    } = this.state;
    const pair = `${depositCoin}_eth`;
    const data = {
      withdrawal,
      pair,
      returnAddress,
      //  Public api key
      "apiKey": "803d1f5df2ed1b1476e4b9e6bcd089e34d8874595dda6a23b67d93c56ea9cc2445e98a6748b219b2b6ad654d9f075f1f1db139abfa93158c04e825db122c14b6",
    };

    if (isValidAddress(withdrawal)) {
      buyWithShapeShift(data)
        .then(d => this.setState({
          showQrCode: true,
          depositAddress: d.deposit,
          isLoading: false,
        }))
        .catch(() => this.setState({
          showQrCode: false,
          errorMessage: this.props.intl.formatMessage({id: "pages.shapeshift-form.invalidRequest"}),
          isLoading: false,
        }));
    }
  }

  renderMetadata (label, value) {
    return (
      <div className="shapeshift-form__metadata-wrapper">
        <div className="shapeshift-form__metadata-label">
          <span>{label}</span>
        </div>
        <div className="shapeshift-form__metadata-value">
          <span>{value}</span>
        </div>
      </div>
    );
  }

  renderMarketInfo () {
    const {
      tokenExchangeRates,
      intl,
    } = this.props;
    const {
      limit,
      rate,
      minimum,
    } = tokenExchangeRates[this.getCoinPair()] || {};

    return (
      <div className="shapeshift-form__metadata">
        {this.renderMetadata(
          intl.formatMessage({
            id: `modals.shapeshift-form.status`,
          }),
          limit
            ? intl.formatMessage({
              id: `modals.shapeshift-form.available`,
            })
            : intl.formatMessage({
              id: `modals.shapeshift-form.unavailable`,
            }),
        )}
        {this.renderMetadata(
          intl.formatMessage({
            id: `modals.shapeshift-form.limit`,
          }),
          limit,
        )}
        {this.renderMetadata(
          intl.formatMessage({
            id: `modals.shapeshift-form.exchangeRate`,
          }),
          rate,
        )}
        {this.renderMetadata(
          intl.formatMessage({
            id: `modals.shapeshift-form.min`,
          }),
          minimum,
        )}
      </div>
    );
  }

  renderQrCode () {
    const {depositAddress, isLoading, depositCoin} = this.state;
    const qrImage = qrcode(4, "M");
    qrImage.addData(depositAddress);
    qrImage.make();

    return (
      <div className="shapeshift-form">
        <div className="shapeshift-form__deposit-instruction">
          <FormattedMessage id="modals.shapeshift-form.depositCoin" values={{depositCoin: depositCoin.toUpperCase()}} />
        </div>
        <div>
          {depositAddress}
        </div>
        <div className="shapeshift-form__qr-code">
          {
            isLoading
              ? <img src="/app/images/loading.svg" style={{width: "60px"}} />
              : <div dangerouslySetInnerHTML={{__html: qrImage.createTableTag(4)}} />
          }
        </div>
        {this.renderMarketInfo()}
      </div>
    );
  }

  render () {
    const {coinOptions, btnClass, warning} = this.props;
    const {errorMessage, showQrCode, depositAddress, depositCoin} = this.state;
    const {tokenExchangeRates} = this.props;
    const token = tokenExchangeRates[this.getCoinPair()];

    return (
      <div className="shapeshift-form-wrapper">
        {showQrCode
          ? this.renderQrCode()
          : <div className="modal-shapeshift-form">
            <div className="shapeshift-form__selectors">
              <div className="shapeshift-form__selector">
                <div className="shapeshift-form__selector-label">
                  <FormattedMessage id="modals.shapeshift-form.deposit" />
                </div>
                <DropdownButton
                  title={depositCoin}
                  bsStyle="default"
                  id="shapeshift-form-coin"
                  onSelect={::this.onCoinChange}
                >
                  {Object.entries(coinOptions).map(([coin]) => {
                    return (
                      <MenuItem key={coin} eventKey={coin.toLowerCase()} active={depositCoin === coin.toLowerCase()}>
                        {coin}
                      </MenuItem>
                    );
                  })}
                </DropdownButton>
              </div>
              <div className="icon.shapeshift-form__caret"
                   style={{backgroundImage: "url(/app/images/caret-right.svg)"}} />

              <div className="shapeshift-form__selector">
                <div className="shapeshift-form__selector-label">
                  <FormattedMessage id="modals.shapeshift-form.receive" />
                </div>
                <div className="shapeshift-form__selector-input">
                  ETH
                </div>
              </div>
            </div>

            {warning && <div className="shapeshift-form__address-input-label">{warning}</div>}
            {!warning && <div className={classnames("shapeshift-form__address-input-wrapper", {
              "shapeshift-form__address-input-wrapper--error": errorMessage,
            })}>
              <div className="shapeshift-form__address-input-label">
                <FormattedMessage id="modals.shapeshift-form.refundAddress" />
              </div>
              <input
                type="text"
                className="shapeshift-form__selector-input"
                onChange={e => this.setState({
                  refundAddress: e.target.value,
                  errorMessage: "",
                })}
              />
            </div>}
            {!warning && this.renderMarketInfo()}
          </div>
        }
        {!depositAddress &&
          <button
            className={classnames("btn btn-primary shapeshift-form__shapeshift-buy-btn", btnClass)}
            disabled={!token}
            onClick={::this.onBuyWithShapeShift}
          >
            <FormattedMessage id="buttons.buy" />
          </button>
        }
      </div>
    );
  }
}


