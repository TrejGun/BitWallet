import React, {Component, Fragment} from "react";
import {Col, Grid, Row} from "react-bootstrap";
import Asset from "./asset";
import LoadingScreen from "../../../../loading-screen";
import {FormattedMessage} from "react-intl";


export default class Assets extends Component {

  state = {
    isLoading: false,
    assets: [{id: 1}, {id: 2}, {id: 3}, {id: 4}],
  };

  renderAssetListItem (asset) {
    return (
      <Asset key={asset.id} data={asset}/>
    );
  }

  renderAssetsList () {
    const {assets, isLoading} = this.state;

    if (isLoading) {
      return (
        <LoadingScreen/>
      );
    }

    return (
      <Row className="assets">
        {assets.map(::this.renderAssetListItem)}
      </Row>
    );
  }

  render () {
    const {assets} = this.state;

    return (
      <Fragment>
        <Grid className="caption">
          <Row>
            <Col xs={8}>
              <FormattedMessage id="pages.home.tabs.assets.assetCount" values={{count: assets.length}}/>
            </Col>
            <Col xs={4}>
              {/* here be dragons */}
            </Col>
          </Row>
        </Grid>
        {this.renderAssetsList()}
      </Fragment>
    );
  }
}
