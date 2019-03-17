import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import UserComment from "./UserComment";

export class UserComments extends Component {
  componentDidMount() {
    // Once the component mounts, grab the comments of the given user.
    // Add check to see if 0 results. If so, redirect to error page.
    this.props.getSpecificUserComments(this.props.match.params.username);
  }

  render() {
    // Shortener to avoid using this.props.specificUserComments everywhere.
    let specificUserComments = this.props.specificUserComments;
    // Object mapping approach adapted from: https://stackoverflow.com/a/39965962
    // If the specificUserComments is null, just return an empty div. Otherwise, create a UserComment component for each comment.
    return specificUserComments ? (
      Object.keys(specificUserComments).map(key => {
        // The key is the comment ID
        return (
          <UserComment key={key} userInformation={specificUserComments[key]} />
        );
      })
    ) : (
      <div />
    );
  }
}

export default withRouter(UserComments);
