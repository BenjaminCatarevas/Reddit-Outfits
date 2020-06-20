import React, { Component } from "react";
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

  sortByAscendingScore = () => {
    // Set state of App to sort comments by ascending score
    this.props.sortCommentsFromSpecificThreadByAscendingScore();
  };

  sortByDescendingScore = () => {
    // Set state of App to sort comments by descending score
    this.props.sortCommentsFromSpecificThreadByDescendingScore();
  };

  sortByAscendingDate = () => {
    // Set state of App to sort comments by ascending date
    this.props.sortCommentsFromSpecificThreadByAscendingDate();
  };

  sortByDescendingDate = () => {
    // Set state of App to sort comments by descending date
    this.props.sortCommentsFromSpecificThreadByDescendingDate();
  };

  timestampToDate(timestamp) {
    // Multiply by 1000 because the timestamp is in miliseconds.
    let date = new Date(timestamp * 1000);
    return date.toDateString();
  }

  render() {
    // If the commentsFromSpecificThread is null, just return an empty div. Otherwise, create a UserComment component for each comment.
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

          /*
       TODO: Figure out why text is not aligned properly in UserComment of UserComments but is aligned in ThreadDisplayer
       */
          return (
            <ExpansionPanel
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
  commentsFromSpecificThread: PropTypes.array.isRequired
};

export default ThreadDisplayer;
