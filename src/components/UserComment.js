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
    const { userInformation } = this.props;

    let threadDate = new Date(userInformation.commentTimestamp * 1000);
    let humanDate = threadDate.toDateString();

    return (
      <div className="container" style={commentContainerStyle}>
        <h6 style={textDisplayStyle}>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={userInformation.commentPermalink}
          >
            Permalink
          </a>{" "}
          | Score: {userInformation.commentScore} | Posted: {humanDate} at{" "}
          {threadDate.toLocaleTimeString("en-US")} by{" "}
          <a href={`http://localhost:3000/u/${userInformation.authorName}`}>
            {userInformation.authorName}
          </a>
        </h6>
        <BigImageDisplay
          bigImageToDisplay={this.state.bigImageToDisplay}
          comment={userInformation.commentBody}
        />
        <ImageSelector
          bigImageToDisplay={this.state.bigImageToDisplay}
          outfits={userInformation.outfits}
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
  marginBottom: "10px",
  background: "#f5f7f9"
};

const textDisplayStyle = {
  textAlign: "center"
};

UserComment.propTypes = {
  userInformation: PropTypes.object.isRequired
};

export default withRouter(UserComment);
