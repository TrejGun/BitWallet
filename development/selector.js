import React, {Component} from "react";
import PropType from "prop-types";


export default class Selector extends Component {

  static propTypes = {
    states: PropType.object,
    selectedKey: PropType.string,
    update: PropType.func,
    store: PropType.string,
    modifyBackgroundConnection: PropType.func,
    backGroundConnectionModifiers: PropType.object,
  };

  render () {
    const {
      states,
      selectedKey,
      update,
      store,
      modifyBackgroundConnection,
      backGroundConnectionModifiers,
    } = this.props;

    const state = this.state || {};
    const selected = state.selected || selectedKey;

    return (
      <select
        value={selected}
        onChange={e => {
          const selectedKey = e.target.value;
          const backgroundConnectionModifier = backGroundConnectionModifiers[selectedKey];
          modifyBackgroundConnection(backgroundConnectionModifier || {});
          store.dispatch(update(selectedKey));
          this.setState({selected: selectedKey});
        }}
      >
        {Object.keys(states).map((stateName) => {
          return (
            <option value={stateName} key={stateName}>
              {stateName}
            </option>
          );
        })}
      </select>
    );
  }
}
