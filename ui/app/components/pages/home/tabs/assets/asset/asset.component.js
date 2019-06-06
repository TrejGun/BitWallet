import React, {Component} from "react";
import {Col, Panel, Image, Button} from "react-bootstrap";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";


export default class Assets extends Component {

  static propTypes = {
    data: PropTypes.object,
  };

  onClick () {
    alert("not implemented");
  }

  render () {
    const {data} = this.props;

    return (
      <Col xs={6}>
        <Panel>
          <Image src={`/app/images/preview/preview_${data.id}.png`}/>
          <Button bsStyle="default" onClick={::this.onClick}>
            <FormattedMessage id="buttons.send"/>
          </Button>
        </Panel>
      </Col>
    );
  }
}
