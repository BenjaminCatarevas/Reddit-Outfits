import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import UserComment from "./UserComment";
import TimeChart from "./TimeChart";
import PropTypes from "prop-types";

export class UserComments extends Component {
  componentDidMount() {
    const {
      match: { params }
    } = this.props;
    // Once the component mounts, grab the comments of the given user.
    // TODO: Add check to see if 0 results. If so, redirect to error page.
    this.props.getCommentsFromSpecificUser(params.username);
  }

  render() {
    const { commentsFromSpecificUser } = this.props;
    // Convert user data into x/y data for data visualization:
    let scoreAndDateData = [];
    for (let commentId in commentsFromSpecificUser) {
      // Extract score and timestamp
      let score = commentsFromSpecificUser[commentId].commentScore;
      let timestamp = commentsFromSpecificUser[commentId].commentTimestamp;
      // Create formatted date
      let d = new Date(timestamp * 1000);
      let formattedDate =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      // Create dictionary of each value for displaying
      let dataDict = {
        score,
        date: formattedDate
      };
      // Add dictionary to array for displaying
      scoreAndDateData.push(dataDict);
    }
    // Sort the data by
    scoreAndDateData.sort((a, b) => {
      let aDate = Date.parse(a.date);
      let bDate = Date.parse(b.date);
      return aDate > bDate ? 1 : -1;
    });
    // Object mapping approach adapted from: https://stackoverflow.com/a/39965962
    return commentsFromSpecificUser ? (
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
        <div id="user-barchart-container" style={svgStyle}>
          <TimeChart
            data={scoreAndDateData}
            width={1000}
            height={1000}
            xAxisLabel={"Date posted"}
            yAxisLabel={"Score"}
          />
        </div>
        {Object.keys(commentsFromSpecificUser).map(key => {
          // The key defaults to the comment ID, since that's the key to index into a given object.
          return (
            <UserComment
              key={key}
              userInformation={commentsFromSpecificUser[key]}
            />
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
