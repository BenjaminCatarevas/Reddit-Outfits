import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { ImageSelector } from "./ImageSelector";
import { BigImageDisplay } from "./BigImageDisplay";
import PropTypes from "prop-types";

export class UserComment extends Component {
  state = {
    bigImageToDisplay: this.props.userInformation.outfits[0]
  };

  setBigImageToDisplay = imageUrl => {
    this.setState({ bigImageToDisplay: imageUrl });
  };

  render() {
    let threadDate = new Date(
      this.props.userInformation.commentTimestamp * 1000
    );
    let humanDate = threadDate.toDateString();

    return (
      <div className="container" style={commentContainerStyle}>
        <h6 style={textDisplayStyle}>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={this.props.userInformation.commentPermalink}
          >
            Permalink
          </a>{" "}
          | Score: {this.props.userInformation.commentScore} | Posted:{" "}
          {humanDate} at {threadDate.toLocaleTimeString("en-US")}
        </h6>
        <BigImageDisplay
          bigImageToDisplay={this.state.bigImageToDisplay}
          comment={this.props.userInformation.commentBody}
        />
        <ImageSelector
          bigImageToDisplay={this.state.bigImageToDisplay}
          outfits={this.props.userInformation.outfits}
          setBigImageToDisplay={this.setBigImageToDisplay}
        />
      </div>
    );
  }
}

const commentContainerStyle = {
  border: "2px solid #8B8C89",
  maxWidth: "75%",
  marginTop: "10px",
  marginBottom: "10px"
};

const textDisplayStyle = {
  textAlign: "center"
};

UserComment.propTypes = {
  userInformation: PropTypes.object.isRequired
};

export default withRouter(UserComment);
