import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Input from "./input/input.addons.group.validation";


export default class EditableLabel extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    defaultValue: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    defaultValue: "",
  };

  state = {
    isEditing: false,
    value: this.props.defaultValue,
  };

  handleSubmit () {
    const {value} = this.state;
    const {onSubmit} = this.props;

    if (value === "") {
      return;
    }

    Promise.resolve(onSubmit(value))
      .then(() => this.setState({isEditing: false}));
  }

  saveIfEnter (e) {
    if (e.key === "Enter") {
      this.handleSubmit();
    }
  }

  renderEditing () {
    const {value} = this.state;

    return (
      <Fragment>
        <Input
          className="large-input editable-label__input"
          type="text"
          required
          value={value}
          onKeyPress={::this.saveIfEnter}
          onChange={e => this.setState({value: e.target.value})}
        />
        <div className="editable-label__icon-wrapper">
          <i className="fa fa-check editable-label__icon" onClick={::this.handleSubmit} />
        </div>
      </Fragment>
    );
  }

  renderReadonly () {
    const {value} = this.state;

    return (
      <Fragment>
        <div className="editable-label__value">
          {value}
        </div>
        <div className="editable-label__icon-wrapper">
          <i className="fa fa-pencil editable-label__icon" onClick={() => this.setState({isEditing: true})} />
        </div>
      </Fragment>
    );
  }

  render () {
    const {isEditing} = this.state;
    const {className} = this.props;

    return (
      <div className={classnames("editable-label", className)}>
        {isEditing ? this.renderEditing() : this.renderReadonly()}
      </div>
    );
  }
}
