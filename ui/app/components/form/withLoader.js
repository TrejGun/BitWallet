import React, {Component} from "react";
import PropTypes from "prop-types";
import LoadingScreen from "../loading-screen";
import {omit} from "lodash";
import {connect} from "react-redux";


function mapStateToProps ({appState}) {
  const {isLoading} = appState;

  return {
    isLoading,
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}


export default function withLoader (loadingMessage) {
  return WrappedComponent => {
    @connect(mapStateToProps, mapDispatchToProps)
    class LoaderHelper extends Component {

      static propTypes = {
        isLoading: PropTypes.bool.isRequired,
      };

      render () {
        const {isLoading} = this.props;
        const props = omit(this.props, ["isLoading"]);

        if (isLoading) {
          return null;
          return (
            <LoadingScreen loadingMessage={loadingMessage}/>
          );
        }

        return (
          <WrappedComponent
            {...props}
          />
        );
      }
    }

    return LoaderHelper;
  };
}
