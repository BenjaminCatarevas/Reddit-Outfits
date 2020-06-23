import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import UserComment from "./UserComment";
import PropTypes from "prop-types";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CircularProgress from "@material-ui/core/CircularProgress";

export class UserComments extends Component {
  componentDidMount() {
    // Extract URL parameters
    const {
      match: { params }
    } = this.props;
    // Once the component mounts, grab the comments of the given user.
    // TODO: Add check to see if 0 results. If so, redirect to error page.
    this.props.getCommentsFromSpecificUser(params.username);
  }

  /**
   * This function invokes the App.js-level function to sort the user comments in increasing order of score.
   */
  sortByAscendingScore = () => {
    // Set state of App to sort comments by ascending score
    this.props.sortCommentsFromSpecificUserByAscendingScore();
  };

  /**
   * This function invokes the App.js-level function to sort the user comments in decreasing order of score.
   */
  sortByDescendingScore = () => {
    // Set state of App to sort comments by descending score
    this.props.sortCommentsFromSpecificUserByDescendingScore();
  };

  /**
   * This function invokes the App.js-level function to sort the user comments from newest to oldest date.
   */
  sortByAscendingDate = () => {
    // Set state of App to sort comments by ascending date
    this.props.sortCommentsFromSpecificUserByAscendingDate();
  };

  /**
   * This function invokes the App.js-level function to sort the user comments from oldest to newest date.
   */
  sortByDescendingDate = () => {
    // Set state of App to sort comments by descending date
    this.props.sortCommentsFromSpecificUserByDescendingDate();
  };

  render() {
    // Object mapping approach adapted from: https://stackoverflow.com/a/39965962
    return this.props.commentsFromSpecificUser.length !== 0 ? (
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
        <button onClick={this.sortByAscendingScore}>Score ↑</button>
        <button onClick={this.sortByDescendingScore}>Score ↓</button>
        <button onClick={this.sortByAscendingDate}>Date ↑</button>
        <button onClick={this.sortByDescendingDate}>Date ↓</button>
        {this.props.commentsFromSpecificUser.map(comment => {
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
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://reddit.com/u/${comment.authorName}`}
                >
                  {comment.authorName}
                </a>
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }
}

UserComments.propTypes = {
  getCommentsFromSpecificUser: PropTypes.func.isRequired,
  commentsFromSpecificUser: PropTypes.array.isRequired,
  sortCommentsFromSpecificUserByAscendingScore: PropTypes.func.isRequired,
  sortCommentsFromSpecificUserByDescendingScore: PropTypes.func.isRequired,
  sortCommentsFromSpecificUserByAscendingDate: PropTypes.func.isRequired,
  sortCommentsFromSpecificUserByDescendingDate: PropTypes.func.isRequired
};

export default withRouter(UserComments);
