import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

export class BigImageDisplay extends Component {
  // Adapted from: https://github.com/rexxars/react-markdown/issues/65#issuecomment-288083389
  // Used in order to make rendered Markdown have links that open in new tab.
  LinkRenderer(props) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    );
  }

  render() {
    const { bigImageToDisplay, comment } = this.props;

    return (
      <div className="row">
        <div className="col-xs-6 float-left" style={bigImageStyle}>
          <img
            style={{ width: "100%" }}
            src={bigImageToDisplay}
            alt={bigImageToDisplay}
          />
        </div>
        <div style={commentStyle} className="col-xs-6">
          <ReactMarkdown
            escapeHtml={true}
            source={comment}
            renderers={{ link: this.LinkRenderer }}
          />
        </div>
      </div>
    );
  }
}

const bigImageStyle = {
  width: "25%",
  height: "25%",
  marginLeft: "5px",
  marginBottom: "10px"
};

const commentStyle = {
  marginLeft: "5px",
  float: "right"
};

BigImageDisplay.propTypes = {
  bigImageToDisplay: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired
};

export default BigImageDisplay;
