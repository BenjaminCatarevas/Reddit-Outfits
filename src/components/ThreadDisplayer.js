import React, { Component } from "react";
import UserComment from "./UserComment";

export class ThreadDisplayer extends Component {
  componentDidMount() {
    this.props.getCommentsOfThreadByThreadId(
      this.props.match.params.subreddit,
      this.props.match.params.threadId
    );
  }

  render() {
    // Shortener to avoid using this.props.commentsFromSpecificThread everywhere.
    let { commentsFromSpecificThread } = this.props;
    // Object mapping approach adapted from: https://stackoverflow.com/a/39965962
    // If the commentsFromSpecificThread is null, just return an empty div. Otherwise, create a UserComment component for each comment.
    return commentsFromSpecificThread ? (
      Object.keys(commentsFromSpecificThread).map(key => {
        // The key defaults to the comment ID, since that's the key to index into a given object.
        return (
          <UserComment
            key={key}
            userInformation={commentsFromSpecificThread[key]}
          />
        );
      })
    ) : (
      <div />
    );
  }
}

export default ThreadDisplayer;
