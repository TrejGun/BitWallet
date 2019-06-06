import React, {Component} from "react";
import PropTypes from "prop-types";
import {shuffle} from "lodash";
import {DEFAULT_ROUTE} from "../../../../../ui/app/routes";
import {Button, ButtonToolbar} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import Input from "../../../../../ui/app/components/input/input.group.validation";


export default class ConfirmSeed extends Component {
  static propTypes = {
    seedWords: PropTypes.string,
    confirmSeedWords: PropTypes.func,
    history: PropTypes.object,
    openBuyEtherModal: PropTypes.func,
  };

  static defaultProps = {
    seedWords: "",
  };

  constructor (props) {
    super(props);
    const {seedWords} = props;
    this.state = {
      selectedSeeds: [],
      shuffledSeeds: seedWords && shuffle(seedWords.split(" ")) || [],
    };
  }

  componentWillMount () {
    const {seedWords, history} = this.props;

    if (!seedWords) {
      history.push(DEFAULT_ROUTE);
    }
  }

  onClickNext () {
    const {confirmSeedWords, history, openBuyEtherModal} = this.props;

    confirmSeedWords()
      .then(() => {
        history.push(DEFAULT_ROUTE);
        openBuyEtherModal();
      });
  }

  render () {
    const {seedWords} = this.props;
    const {selectedSeeds, shuffledSeeds} = this.state;
    const isValid = seedWords === selectedSeeds.map(([_, seed]) => seed).join(" ");

    return (
      <div className="confirm-seed">
        <div className="first-time-flow__title">
          <FormattedMessage id="pages.confirmSeed.title"/>
        </div>
        <div className="first-time-flow__description">
          <FormattedMessage id="pages.confirmSeed.description"/>
        </div>
        <Input
          componentClass="textarea"
          readOnly
          value={selectedSeeds.map(([_, word]) => word).join(" ")}
        />
        <div className="confirm-seed__confirm-seed-options">
          {shuffledSeeds.map((word, i) => {
            const isSelected = selectedSeeds
              .filter(([index, seed]) => seed === word && index === i)
              .length;

            return (
              <Button
                key={i}
                bsStyle={isSelected ? "default" : "primary"}
                onClick={() => {
                  if (!isSelected) {
                    this.setState({
                      selectedSeeds: [...selectedSeeds, [i, word]],
                    });
                  } else {
                    this.setState({
                      selectedSeeds: selectedSeeds
                        .filter(([index, seed]) => !(seed === word && index === i)),
                    });
                  }
                }}
              >
                {word}
              </Button>
            );
          })}
        </div>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            onClick={::this.onClickNext}
            disabled={!isValid}
          >
            <FormattedMessage id="buttons.confirm"/>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

