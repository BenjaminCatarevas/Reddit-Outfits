import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import ThreadListItem from "./ThreadListItem";

export class ThreadList extends Component {
  // Big link that goes to thread display page on reddit outfits
  // Subtext that has # comments and # outfits
  // 4 random outfits
  componentDidMount() {
    const {
      match: { params }
    } = this.props;

    // If the user requested a specific subreddit, use that.
    if (params.subreddit) {
      this.props.getThreadsBySubreddit(params.subreddit);
    } else {
      this.props.getAllThreads();
    }
  }

  render() {
    const { allThreads } = this.props;
    // If the threads state is null, return an empty div, else return Thread components for each thread.
    return allThreads ? (
      allThreads.map(thread => {
        return (
          <div key={thread.thread_id} className="row">
            <div className="container" id="thread-item-container">
              <ThreadListItem
                key={thread.thread_id}
                threadInformation={thread}
              />
            </div>
          </div>
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
