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

  componentDidMount() {
    const {
      match: { params }
    } = this.props;

    this.props.getThreadsBySubreddit(params.subreddit);
    this.setState({ displayedSubreddit: params.subreddit });
  }

  /**
   * This function capitalizes the given word.
   * The reason this function exists is because the current subreddit is retrieved via the URL.
   * Thus, it is all lowercase, when it looks much nicer to have the first letter capitalized when presented.
   * @param {string} word Word to be capitalized.
   */
  capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  /**
   * This function converts a Unix timestamp to a human-readable date.
   * @param {Number} date Unix timestamp.
   */
  createHumanDate(date) {
    return new Date(date).toDateString();
  }

  /**
   * This function retrieves the year, month, and day of a Date object for future usability.
   * @param {object} date Date object.
   */
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

  /**
   * This function sets the state to be the start date chosen by the end user.
   * @param {object} startDate Date object representing the starting date for the date-picker.
   */
  changeStartDate = startDate => {
    this.setState({ startDate });
  };

  /**
   * This function sets the state to be the end date chosen by the end user.
   * @param {object} endDate Date object representing the ending date for the date-picker.
   */
  changeEndDate = endDate => {
    this.setState({ endDate });
  };

  /**
   * This function calls the App.js-level function to filter the list of all threads to only contain those in the specified date range.
   */
  filterThreads = () => {
    this.props.filterThreads(this.state.startDate, this.state.endDate);
  };

  /**
   * This function calls the App.js-level function to reset the currently filtered threads to instead be all threads.
   */
  resetData = () => {
    this.props.resetFilteredThreads();
  };

  render() {
    const { filteredThreads, allThreads } = this.props;
    const { startDate, endDate } = this.state;

    /**
     * If the list of thredas is empty, return a loading bar.
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
