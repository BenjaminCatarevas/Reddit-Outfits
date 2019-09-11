import React, { Component } from "react";
import UserComment from "./UserComment";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";

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
    let { commentsFromSpecificThread } = this.props;
    // Object mapping approach adapted from: https://stackoverflow.com/a/39965962
    // If the commentsFromSpecificThread is null, just return an empty div. Otherwise, create a UserComment component for each comment.
    return commentsFromSpecificThread ? (
      commentsFromSpecificThread.map(comment => {
        // The key defaults to the comment ID, since that's the key to index into a given object.

        let threadDate = new Date(comment.commentTimestamp * 1000);
        let humanDate = threadDate.toDateString();

        /* TODO: Figure out why there's no space around the Link element. */
        /*
       TODO: Figure out why text is not aligned properly in UserComment of UserComments but is aligned in ThreadDisplayer
       */
        const topOfWindowRef = React.createRef();
        return (
          <ExpansionPanel defaultExpanded={true} ref={topOfWindowRef}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              Posted by
              <Link to={`/u/${comment.authorName}`}>{comment.authorName}</Link>
              on {humanDate} at {threadDate.toLocaleTimeString("en-US")} with a
              score of {comment.commentScore}
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
      })
    ) : (
      <div />
    );
  }
}

export default ThreadDisplayer;
