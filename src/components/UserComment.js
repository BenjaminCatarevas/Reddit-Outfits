import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { ImageSelector } from "./ImageSelector";
import { BigImageDisplay } from "./BigImageDisplay";
import PropTypes from "prop-types";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

export class UserComment extends Component {
  state = {
    bigImageToDisplay: this.props.userInformation.outfits[0]
  };

  // Reference to give to ImageSelector
  topOfWindowRef = React.createRef();

  setBigImageToDisplay = imageUrl => {
    this.setState({ bigImageToDisplay: imageUrl });
  };

  render() {
    const { userInformation } = this.props;

    return (
      <div
        className="container"
        id="user-comment-displayer"
        style={commentContainerStyle}
        ref={this.topOfWindowRef}
      >
        <h6 style={textDisplayStyle}>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={userInformation.commentPermalink}
          >
            <OpenInNewIcon />
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
          topOfWindowRef={this.topOfWindowRef}
        />
      </div>
    );
  }
}

const commentContainerStyle = {
  border: "2px solid #8B8C89",
  marginTop: "10px",
  marginBottom: "10px",
  background: "#eee"
};

const textDisplayStyle = {
  textAlign: "center",
  marginTop: "7.5px",
  float: "right"
};

UserComment.propTypes = {
  userInformation: PropTypes.object.isRequired
};

export default withRouter(UserComment);
