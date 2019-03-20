import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

export class ThreadItem extends Component {
  render() {
    // Multiply 1000 since Date takes in miliseconds, not seconds.
    let threadDate = new Date(this.props.threadInformation.timestamp * 1000);
    let humanDate = threadDate.toDateString();

    let numOutfits = this.props.threadInformation.num_top_level_comments;
    let numTotalComments = this.props.threadInformation.num_total_comments;

    /*
        num_top_level_comments: 1
        num_total_comments: null
        subreddit: "malefashionadvice"
        subreddit_id: "t5_2r65t"
        thread_id: "test"
        thread_permalink: "test"
        thread_score: 1
        thread_title: "test"
        timestamp: 1
        */
    return (
      <div className="container">
        <div className="row">
          <h6 style={threadDisplayStyle}>
            <a
              href={`http://localhost:3000/r/${
                this.props.threadInformation.subreddit
              }/${this.props.threadInformation.thread_id}`}
            >
              {humanDate}
            </a>{" "}
            | Number of outfits: {numOutfits} | Number of total comments:{" "}
            {numTotalComments} |{" "}
            <a href={this.props.threadInformation.thread_permalink}>
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

ThreadItem.propTypes = {
  threadInformation: PropTypes.object.isRequired
};

export default withRouter(ThreadItem);
