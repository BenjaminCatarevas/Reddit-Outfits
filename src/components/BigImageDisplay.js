import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

export class BigImageDisplay extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-xs-6">
          <img
            style={bigImageStyle}
            className="img-responsive float-left"
            src={this.props.outfit}
            alt={this.props.outfit}
          />
        </div>
        <div className="col-xs-6">
          <ReactMarkdown escapeHtml={true} source={this.props.comment} />
        </div>
      </div>
    );
  }
}

const bigImageStyle = {
  width: "50%",
  height: "auto",
  marginLeft: "5px"
};

BigImageDisplay.propTypes = {
  outfit: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired
};

export default BigImageDisplay;
