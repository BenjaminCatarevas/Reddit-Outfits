import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import UserComment from "./UserComment";
import PropTypes from "prop-types";

export class UserComments extends Component {
  componentDidMount() {
    // Once the component mounts, grab the comments of the given user.
    // Add check to see if 0 results. If so, redirect to error page.
    this.props.getCommentsFromSpecificUser(this.props.match.params.username);
  }

  render() {
    // Shortener to avoid using this.props.commentsFromSpecificUser everywhere.
    let { commentsFromSpecificUser } = this.props;
    // Object mapping approach adapted from: https://stackoverflow.com/a/39965962
    // If the commentsFromSpecificUser is null, just return an empty div. Otherwise, create a UserComment component for each comment.
    return commentsFromSpecificUser ? (
      Object.keys(commentsFromSpecificUser).map(key => {
        // The key defaults to the comment ID, since that's the key to index into a given object.
        return (
          <UserComment
            key={key}
            userInformation={commentsFromSpecificUser[key]}
          />
        );
      })
    ) : (
      <div />
    );
  }
}

UserComments.propTypes = {
  getCommentsFromSpecificUser: PropTypes.func.isRequired
};

export default withRouter(UserComments);
