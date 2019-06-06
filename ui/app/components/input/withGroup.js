import React, {Component} from "react";
import PropTypes from "prop-types";
import {omit} from "lodash";
import {Col, ControlLabel, FormGroup, Glyphicon, HelpBlock} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


export default function withGroup (Input) {
  return class InputWithGroup extends Component {
    static propTypes = {
      name: PropTypes.string,
      required: PropTypes.bool,
      validation: PropTypes.shape({
        name: PropTypes.string,
        reason: PropTypes.string,
      }),
      children: PropTypes.node,
    };

    render () {
      const {name, validation} = this.props;
      const props = omit(this.props, ["validation"]);
      return (
        <FormGroup controlId={name} validationState={validation ? "error" : null}>
          <Col componentClass={name ? ControlLabel : () => null}>
            <FormattedMessage id={`fields.${name}.label`}/>
            {this.renderAsterisk()}
          </Col>
          <Col>
            <Input {...props} />
            {this.renderHelper()}
          </Col>
        </FormGroup>
      );
    }

    renderAsterisk () {
      const {required} = this.props;
      if (!required) {
        return null;
      }
      return (
        <sup>
          <Glyphicon glyph="asterisk"/>
        </sup>
      );
    }

    renderHelper () {
      const {validation} = this.props;
      if (!validation) {
        return null;
      }
      return (
        <HelpBlock>
          <FormattedMessage id={`fields.${validation.name}.${validation.reason}`} defaultMessage={validation.reason}/>
        </HelpBlock>
      );
    }
  };
}
