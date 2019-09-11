import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import UserComment from "./UserComment";
import TimeBarChart from "./TimeBarChart";
import PropTypes from "prop-types";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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

  sortByAscendingScore = () => {
    this.child.sortByAscendingScore();
    // Set state of App to sort comments by ascending score
    this.props.sortCommentsFromSpecificUserByAscendingScore();
  };

  sortByDescendingScore = () => {
    this.child.sortByDescendingScore();
    // Set state of App to sort comments by descending score
    this.props.sortCommentsFromSpecificUserByDescendingScore();
  };

  sortByAscendingDate = () => {
    this.child.sortByAscendingDate();
    // Set state of App to sort comments by ascending date
    this.props.sortCommentsFromSpecificUserByAscendingDate();
  };

  sortByDescendingDate = () => {
    this.child.sortByDescendingDate();
    // Set state of App to sort comments by descending date
    this.props.sortCommentsFromSpecificUserByDescendingDate();
  };

  createChartData(data) {
    // Convert user data into x/y data for data visualization:
    let scoreAndDateData = [];
    for (const comment of data) {
      // Extract score, timestamp, and comment permalink
      let score = comment.commentScore;
      let timestamp = comment.commentTimestamp;
      let commentPermalink = comment.commentPermalink;
      // Create formatted date
      let d = new Date(timestamp * 1000);
      let formattedDate =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      // Create dictionary of each value for displaying
      let dataDict = {
        score,
        date: formattedDate,
        commentPermalink
      };
      // Add dictionary to array for displaying
      scoreAndDateData.push(dataDict);
    }

    // Sort the data by ascending date.
    scoreAndDateData.sort((a, b) => {
      let aDate = Date.parse(a.date);
      let bDate = Date.parse(b.date);
      return aDate > bDate ? 1 : -1;
    });
    return scoreAndDateData;
  }

  render() {
    // Object mapping approach adapted from: https://stackoverflow.com/a/39965962
    return this.props.commentsFromSpecificUser ? (
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
        <div id="user-barchart-container" style={svgStyle}>
          <TimeBarChart
            /* Ref forwarding adapted from: https://github.com/kriasoft/react-starter-kit/issues/909#issuecomment-252969542 */
            /*
            We forward a ref because we want to add buttons at the UserComments level.
            This is because if we append buttons at the TimeBarChart level, the buttons will move if the SVG moves.
            We want the buttons to remain in the same place, but be able to call functions defined in the TimeBarChart.
            Specifically, we want the buttons to sort the data as it's displayed in the TimeBarChart SVG as well as sorting the comments of each user in the same manner.
            To meet all of these prerequisites requires forwarding a ref in order to call child component methods from parent components.
            */

            onRef={ref => (this.child = ref)}
            data={this.createChartData(this.props.commentsFromSpecificUser)}
            width={1000}
            height={300}
            xAxisLabel={"Date posted"}
            yAxisLabel={"Score"}
          />
        </div>
        {this.props.commentsFromSpecificUser.map(comment => {
          // The key defaults to the comment ID, since that's the key to index into a given object.
          const topOfWindowRef = React.createRef();

          return (
            <ExpansionPanel defaultExpanded={true} ref={topOfWindowRef}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                Posted by{" "}
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://reddit.com/u/${comment.authorName}`}
                >
                  {comment.authorName} with a score of {comment.commentScore}
                </a>
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
      <div />
    );
  }
}

const svgStyle = {
  // Forces the SVG element to have a scrollbar to fit in line with the rest of the page.
  // The width and height must be smaller than the SVG element.
  width: "900",
  height: "900",
  overflow: "auto"
};

UserComments.propTypes = {
  getCommentsFromSpecificUser: PropTypes.func.isRequired
};

export default withRouter(UserComments);
