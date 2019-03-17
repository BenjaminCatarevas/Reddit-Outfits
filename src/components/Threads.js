import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Thread from "./Thread";

export class Threads extends Component {
  componentDidMount() {
    // If the user requested a specific subreddit, use that.
    if (this.props.match.params.subreddit) {
      this.props.getSpecificThreads(this.props.match.params.subreddit);
    } else {
      this.props.getAllThreads();
    }
  }

  render() {
    // If the threads state is null, return an empty div, else return Thread components for each thread.
    return this.props.allThreads ? (
      this.props.allThreads.map(thread => {
        return <Thread key={thread.thread_id} threadInformation={thread} />;
      })
    ) : (
      <div />
    );
  }
}

Threads.propTypes = {
  getSpecificThreads: PropTypes.func.isRequired,
  getAllThreads: PropTypes.func.isRequired,
  allThreads: PropTypes.object.isRequired
};

export default withRouter(Threads);
