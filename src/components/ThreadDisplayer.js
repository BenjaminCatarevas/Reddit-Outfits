import React, { Component } from "react";
import UserComment from "./UserComment";

export class ThreadDisplayer extends Component {
  componentDidMount() {
    const {
      match: { params }
    } = this.props;

    this.props.getCommentsOfThreadByThreadDate(
      params.subreddit,
      params.year,
      params.month,
      params.day
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
