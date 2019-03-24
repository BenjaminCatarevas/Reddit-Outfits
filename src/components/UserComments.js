import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import UserComment from "./UserComment";
import PropTypes from "prop-types";

export class UserComments extends Component {
  componentDidMount() {
    const {
      match: { params }
    } = this.props;
    // Once the component mounts, grab the comments of the given user.
    // Add check to see if 0 results. If so, redirect to error page.
    this.props.getCommentsFromSpecificUser(params.username);
  }

  render() {
    // Use object destructuring to shorten using this.props.commentsFromSpecificUser everywhere.
    const { commentsFromSpecificUser } = this.props;
    // Object mapping approach adapted from: https://stackoverflow.com/a/39965962
    // If the commentsFromSpecificUser is null, just return an empty div. Otherwise, create a UserComment component for each comment.
    return commentsFromSpecificUser ? (
      <div>
        <h6>
          Posts by{" "}
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`https://reddit.com/u/${this.props.match.params.username}`}
          >
            /u/{this.props.match.params.username}
          </a>
        </h6>
        {Object.keys(commentsFromSpecificUser).map(key => {
          // The key defaults to the comment ID, since that's the key to index into a given object.
          return (
            <UserComment
              key={key}
              userInformation={commentsFromSpecificUser[key]}
            />
          );
        })}
      </div>
    ) : (
      <div />
    );
  }
}

UserComments.propTypes = {
  getCommentsFromSpecificUser: PropTypes.func.isRequired
};

export default withRouter(UserComments);
