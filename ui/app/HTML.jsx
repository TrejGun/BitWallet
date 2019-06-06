import React, {Component} from "react";
import PropTypes from "prop-types";


export default class HTML extends Component {
  static propTypes = {
    initialMarkup: PropTypes.string,
    initialState: PropTypes.object,
  };

  render () {
    return (
      <html>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <link href="/bundle/client.css" rel="stylesheet" />
        <title>BitGuild</title>
      </head>
      <body>
      <div id="app" dangerouslySetInnerHTML={{__html: this.props.initialMarkup}} />
      <script src="/bundle/client.js" type="text/javascript" crossOrigin="anonymous" />
      </body>
      </html>
    );
  }
}
