import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { ImageSelector } from "./ImageSelector";
import { BigImageDisplay } from "./BigImageDisplay";
import PropTypes from "prop-types";

export class UserComment extends Component {
  constructor(props) {
    super(props);
    // Create a reference to reset the window to the top of the user comment when a new image is clicked.
    this.topOfWindowRef = React.createRef();
  }

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
      <div
        className="container"
        id="user-comment-displayer"
        style={commentContainerStyle}
        ref={this.props.topOfWindowRef}
      >
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
          <Link to={`/u/${userInformation.authorName}`}>
            {userInformation.authorName}
          </Link>
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
  marginTop: "7.5px"
};

UserComment.propTypes = {
  userInformation: PropTypes.object.isRequired
};

export default withRouter(UserComment);
