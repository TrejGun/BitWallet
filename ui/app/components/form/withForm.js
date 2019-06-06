import React, {Component} from "react";
import {omit} from "lodash";


export default function withForm (WrappedComponent) {
  return class FormHelper extends Component {
    state = {
      // don't remove
    };

    onChange (e) {
      const {name, type, checked, value, files} = e.target;
      if (e.target.tagName === "SELECT") {
        if (type === "select-one") {
          switch (e.target.getAttribute("type")) {
            case "number":
              return this.setState({
                [name]: value === "" ? value : parseFloat(value),
              });
            default:
              return this.setState({
                [name]: value,
              });
          }
        } else { // select-multiple
          switch (e.target.getAttribute("type")) {
            case "number":
              return this.setState({
                [name]: [].slice.call(e.target.selectedOptions).map(a => parseFloat(a.value)),
              });
            default:
              return this.setState({
                [name]: [].slice.call(e.target.selectedOptions).map(a => a.value),
              });
          }
        }
      } else { // INPUT
        switch (type) {
          case "file":
            if (e.target.multiple) {
              return this.setState({
                [name]: files, // FileList
              });
            } else {
              return this.setState({
                [name]: files[0], // File
              });
            }
          case "number":
            return this.setState({
              [name]: value === "" ? value : parseFloat(value),
            });
          case "checkbox":
            return this.setState({
              [name]: checked,
            });
          case "text":
          case "email":
          case "password":
          default:
            return this.setState({
              [name]: value,
            });
        }
      }
    }

    render () {
      const props = omit(this.props, []);

      return (
        <WrappedComponent
          {...props}
          formData={this.state}
          onChange={::this.onChange}
          setState={::this.setState}
        />
      );
    }
  };
}
