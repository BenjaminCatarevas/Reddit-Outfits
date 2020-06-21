import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import UserComment from "./UserComment";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";

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

  /**
   * This function invokes the App.js-level function to sort the thread comments in increasing order of score.
   */
  sortByAscendingScore = () => {
    this.props.sortCommentsFromSpecificThreadByAscendingScore();
  };

  /**
   * This function invokes the App.js-level function to sort the thread comments in decreasing order of score.
   */
  sortByDescendingScore = () => {
    this.props.sortCommentsFromSpecificThreadByDescendingScore();
  };

  /**
   * This function invokes the App.js-level function to sort the thread comments from newest to oldest date.
   */
  sortByAscendingDate = () => {
    this.props.sortCommentsFromSpecificThreadByAscendingDate();
  };

  /**
   * This function invokes the App.js-level function to sort the thread comments from oldest to newest date.
   */
  sortByDescendingDate = () => {
    this.props.sortCommentsFromSpecificThreadByDescendingDate();
  };

  /**
   * This function converts a Unix timestamp in miliseconds from a user comment into a human-readable date.
   * @param {Number} timestamp Unix timestamp in miliseconds.
   */
  timestampToDate(timestamp) {
    // Multiply by 1000 because the comment timestamp is in miliseconds.
    let date = new Date(timestamp * 1000);
    return date.toDateString();
  }

  render() {
    // If the list of comments from a speciic thread is empty, return a loading bar. Otherwise, create a UserComment component for each comment.
    return this.props.commentsFromSpecificThread.length !== 0 ? (
      <div>
        {console.log(this.props.commentsFromSpecificThread)}
        <h6>
          Posts from&nbsp;
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`https://reddit.com/r/malefashionadvice/comments/${this.props.commentsFromSpecificThread[0].threadId}`}
          >
            WAYWT on{" "}
            {this.timestampToDate(
              this.props.commentsFromSpecificThread[0].commentTimestamp
            )}
          </a>
        </h6>
        <button onClick={this.sortByAscendingScore}>Score ↑</button>
        <button onClick={this.sortByDescendingScore}>Score ↓</button>
        <button onClick={this.sortByAscendingDate}>Date ↑</button>
        <button onClick={this.sortByDescendingDate}>Date ↓</button>
        {this.props.commentsFromSpecificThread.map(comment => {
          // The key defaults to the comment ID, since that's the key to index into a given object.
          const topOfWindowRef = React.createRef();

          let threadDate = new Date(comment.commentTimestamp * 1000);
          let humanDate = threadDate.toDateString();

          return (
            <ExpansionPanel
              style={{ margin: "16px" }}
              defaultExpanded={true}
              ref={topOfWindowRef}
              key={comment.commentId}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                Posted by&nbsp;
                <Link to={`/u/${comment.authorName}`}>
                  {comment.authorName}
                </Link>
                &nbsp;on {humanDate} at {threadDate.toLocaleTimeString("en-US")}{" "}
                with a score of {comment.commentScore}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <UserComment
                  key={comment.commentId}
                  userInformation={comment}
                  topOfWindowRef={topOfWindowRef}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </div>
    ) : (
      <div>
        <CircularProgress />
      </div>
    );
  }
}

ThreadDisplayer.propTypes = {
  getCommentsOfThreadByThreadDate: PropTypes.func.isRequired,
  commentsFromSpecificThread: PropTypes.array.isRequired,
  sortCommentsFromSpecificThreadByAscendingScore: PropTypes.func.isRequired,
  sortCommentsFromSpecificThreadByDescendingScore: PropTypes.func.isRequired,
  sortCommentsFromSpecificThreadByAscendingDate: PropTypes.func.isRequired,
  sortCommentsFromSpecificThreadByDescendingDate: PropTypes.func.isRequired
};

export default withRouter(ThreadDisplayer);
