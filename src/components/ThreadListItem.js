import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

export class ThreadListItem extends Component {
  render() {
    const { threadInformation } = this.props;

    // Multiply 1000 since Date takes in seconds, not miliseconds.
    let threadDate = new Date(threadInformation.thread_timestamp * 1000);
    let humanDate = threadDate.toDateString();

    let numOutfits = threadInformation.num_top_level_comments;
    let numTotalComments = threadInformation.num_total_comments;

    return (
      <div className="container">
        <div className="row">
          <h6 style={threadDisplayStyle}>
            <a
              href={`http://localhost:3000/r/${threadInformation.subreddit}/${
                threadInformation.thread_id
              }`}
            >
              {humanDate}
            </a>{" "}
            | Number of outfits: {numOutfits} | Number of total comments:{" "}
            {numTotalComments} |{" "}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={threadInformation.thread_permalink}
            >
              Thread Link
            </a>
          </h6>
        </div>
      </div>
    );
  }
}

const threadDisplayStyle = {
  width: "75%",
  margin: "0 auto",
  padding: "2px"
};

ThreadListItem.propTypes = {
  threadInformation: PropTypes.object.isRequired
};

export default withRouter(ThreadListItem);
