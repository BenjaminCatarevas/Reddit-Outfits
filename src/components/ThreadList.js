import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import ThreadListItem from "./ThreadListItem";

export class ThreadList extends Component {
  // Big link that goes to thread display page on reddit outfits
  // Subtext that has # comments and # outfits
  // 4 random outfits
  componentDidMount() {
    // If the user requested a specific subreddit, use that.
    if (this.props.match.params.subreddit) {
      this.props.getThreadsBySubreddit(this.props.match.params.subreddit);
    } else {
      this.props.getAllThreads();
    }
  }

  render() {
    // If the threads state is null, return an empty div, else return Thread components for each thread.
    return this.props.allThreads ? (
      this.props.allThreads.map(thread => {
        return (
          <ThreadListItem key={thread.thread_id} threadInformation={thread} />
        );
      })
    ) : (
      <div />
    );
  }
}

ThreadList.propTypes = {
  getThreadsBySubreddit: PropTypes.func.isRequired,
  getAllThreads: PropTypes.func.isRequired
};

export default withRouter(ThreadList);
