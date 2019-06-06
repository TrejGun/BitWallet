import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Route} from "react-router-dom";


class MetamaskRoute extends Component {
  static propTypes = {
    component: PropTypes.func,
    mascaraComponent: PropTypes.func,
    isMascara: PropTypes.bool,
  };

  render () {
    const {component, mascaraComponent, isMascara, ...props} = this.props;
    return (
      <Route {...props} component={isMascara && mascaraComponent ? mascaraComponent : component} />
    );
  }
}

function mapStateToProps ({metamask}) {
  const {isMascara} = metamask;
  return {
    isMascara,
  };
}

export default connect(mapStateToProps)(MetamaskRoute);
