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

  render() {
    const { allThreads } = this.props;

    // If the threads state is null, return an empty div, else return Thread components for each thread.
    return allThreads ? (
      <MaterialTable
        title={
          this.state.displayedSubreddit
            ? this.state.displayedSubreddit.charAt(0).toUpperCase() +
              this.state.displayedSubreddit.slice(1) +
              " Threads"
            : "Threads"
        }
        columns={[
          {
            title: "Reddit Outfits Thread Link",
            field: "thread_timestamp",
            render: rowData => {
              let threadDate = new Date(rowData.thread_timestamp * 1000);
              let humanDate = threadDate.toDateString();

              let year = threadDate.getFullYear();
              let month = threadDate.getMonth() + 1;
              let day = threadDate.getDate();

              return (
                <Link to={`/r/${rowData.subreddit}/${year}/${month}/${day}`}>
                  {humanDate}
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
  getAllThreads: PropTypes.func.isRequired
};

export default withRouter(ThreadList);
