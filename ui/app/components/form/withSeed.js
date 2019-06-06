import React, {Component} from "react";
import PropTypes from "prop-types";
import {validateMnemonic} from "bip39";


export const SEED_PHRASE_WORDS_COUNT = 12;

export default function withSeed (WrappedComponent) {
  return class SeedForm extends Component {

    static propTypes = {
      history: PropTypes.object,
      formData: PropTypes.shape({
        seed: PropTypes.string,
      }),
      addValidationMessage: PropTypes.func,
      onChange: PropTypes.func,
      isValid: PropTypes.func,
    };

    handleSeedChange (e) {
      const seed = e.target.value;
      const {addValidationMessage, onChange} = this.props;

      if (seed && seed.split(" ").length !== SEED_PHRASE_WORDS_COUNT) {
        addValidationMessage({
          name: "seed",
          reason: "words",
        });
      } else if (seed && !validateMnemonic(seed)) {
        addValidationMessage({
          name: "seed",
          reason: "invalid",
        });
      }

      onChange(e);
    }

    isValid () {
      const {formData: {seed}, isValid} = this.props;

      if (!seed) {
        return false;
      }

      return isValid();
    }

    render () {
      const props = this.props;

      return (
        <WrappedComponent
          {...props}
          isValid={::this.isValid}
          handleSeedChange={::this.handleSeedChange}
        />
      );
    }
  };
}
