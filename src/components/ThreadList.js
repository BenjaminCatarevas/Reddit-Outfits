import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import MaterialTable from "material-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@material-ui/core/Button";

export class ThreadList extends Component {
  state = {
    displayedSubreddit: "",
    startDate: new Date(),
    endDate: new Date()
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

  changeStartDate = startDate => {
    this.setState({ startDate });
  };

  changeEndDate = endDate => {
    this.setState({ endDate });
  };

  filterThreads = (startDate, endDate) => {
    this.props.filterThreads(this.state.startDate, this.state.endDate);
  };

  resetData = () => {
    this.props.resetFilteredThreads();
  };

  render() {
    const { filteredThreads, allThreads } = this.props;
    const { startDate, endDate } = this.state;

    /**
     * If the threads state is null (meaning no data is loaded), return an empty div.
     * Else return Thread components for each thread.
     * However, we check for the existence of data using the allThreads variable.
     * This is to prevent the disappearence of the component if the user filters down to 0 results via the filteredThreads variable.
     */
    return allThreads.length !== 0 ? (
      <div>
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
                  {`https://redd.it/${rowData.thread_id}`}
                </a>
              )
            }
          ]}
          data={filteredThreads}
          options={{ search: true }}
        />

        <div
          style={{
            height: "100%",
            padding: "0",
            margin: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ width: "auto" }}>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <p>Start Date</p>
              <DatePicker
                selected={startDate}
                onChange={this.changeStartDate}
              />
            </div>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <p>End Date</p>
              <DatePicker selected={endDate} onChange={this.changeEndDate} />
            </div>

            <div style={{ display: "inline-block, flex" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.filterThreads}
                style={{ margin: "8px" }}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={this.resetData}
                style={{ margin: "8px", position: "absolute" }}
              >
                Reset Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div />
    );
  }
}

ThreadList.propTypes = {
  getThreadsBySubreddit: PropTypes.func.isRequired,
  filteredThreads: PropTypes.array.isRequired,
  filterThreads: PropTypes.func.isRequired,
  resetFilteredThreads: PropTypes.func.isRequired
};

export default withRouter(ThreadList);
