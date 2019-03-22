import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

export class BigImageDisplay extends Component {
  render() {
    const { bigImageToDisplay, comment } = this.props;

    return (
      <div className="row">
        <div className="col-xs-6">
          <img
            style={bigImageStyle}
            className="img-responsive float-left"
            src={bigImageToDisplay}
            alt={bigImageToDisplay}
          />
        </div>
        <div style={commentStyle} className="col-xs-6 text-left">
          <ReactMarkdown escapeHtml={true} source={comment} />
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

const commentStyle = {
  marginLeft: "5px"
};

BigImageDisplay.propTypes = {
  bigImageToDisplay: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired
};

export default BigImageDisplay;
