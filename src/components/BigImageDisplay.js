import React, { Component } from "react";
import PropTypes from "prop-types";
const ReactMarkdown = require("react-markdown");

export class BigImageDisplay extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <img
            style={bigImageStyle}
            className="img-responsive float-left"
            src={this.props.outfit}
            alt={this.props.outfit}
          />
          <div className="col-xs-12">
            <ReactMarkdown source={this.props.comment} />
          </div>
        </div>
      </div>
    );
  }
}

const bigImageStyle = {
  width: "50%",
  height: "auto",
  maxWidth: "1000px",
  padding: "5px 5px 5px 5px"
};

BigImageDisplay.propTypes = {
  outfit: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired
};

export default BigImageDisplay;
