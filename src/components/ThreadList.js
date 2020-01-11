import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import MaterialTable from "material-table";

export class ThreadList extends Component {
  state = {
    displayedSubreddit: ""
  };
  // Big link that goes to thread display page on reddit outfits
  // Subtext that has # comments and # outfits
  // 4 random outfits
  componentDidMount() {
    const {
      match: { params }
    } = this.props;

    this.props.getThreadsBySubreddit(params.subreddit);
    this.setState({ displayedSubreddit: params.subreddit });
  }

  capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  createHumanDate(date) {
    return new Date(date).toDateString();
  }

  getYearMonthDay(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return {
      year,
      month,
      day
    };
  }

  render() {
    const { allThreads } = this.props;

    // If the threads state is null, return an empty div, else return Thread components for each thread.
    return allThreads.length !== 0 ? (
      <MaterialTable
        title={
          this.state.displayedSubreddit
            ? this.capitalize(this.state.displayedSubreddit) + " Threads"
            : "Threads"
        }
        columns={[
          {
            title: "Reddit Outfits Thread Link",
            field: "thread_timestamp",
            render: rowData => {
              let threadDate = new Date(rowData.thread_timestamp * 1000);

              let dateInfo = this.getYearMonthDay(threadDate);

              return (
                <Link
                  to={`/r/${rowData.subreddit}/${dateInfo.year}/${dateInfo.month}/${dateInfo.day}`}
                >
                  {this.createHumanDate(threadDate)}
                </Link>
              );
            }
          },
          { title: "Number of outfits", field: "num_top_level_comments" },
          { title: "Number of comments", field: "num_total_comments" },
          {
            title: "Reddit Thread Link",
            field: "thread_permalink",
            render: rowData => (
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={rowData.thread_permalink}
              >
                Thread Link
              </a>
            )
          }
        ]}
        data={allThreads}
        options={{ search: true }}
      />
    ) : (
      <div />
    );
  }
}

ThreadList.propTypes = {
  getThreadsBySubreddit: PropTypes.func.isRequired,
  getAllThreads: PropTypes.func.isRequired,
  allThreads: PropTypes.array.isRequired
};

export default withRouter(ThreadList);
