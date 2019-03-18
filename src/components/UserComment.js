import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { ImageSelector } from "./ImageSelector";
import { BigImageDisplay } from "./BigImageDisplay";
import PropTypes from "prop-types";

export class UserComment extends Component {
  render() {
    // Contains big image component w/ body of comment
    // Contains image selector for all images of current comment
    // One of these for every comment of a user
    // one row in the parent
    return (
      <div className="container" style={commentStyle}>
        <BigImageDisplay
          outfit={this.props.userInformation.outfits[0]}
          comment={this.props.userInformation.commentBody}
        />
        <ImageSelector outfits={this.props.userInformation.outfits} />
      </div>
    );
  }
}

const commentStyle = {
  border: "2px solid #8B8C89",
  margin: "10px"
};

UserComment.propTypes = {
  userInformation: PropTypes.object.isRequired
};

export default withRouter(UserComment);
