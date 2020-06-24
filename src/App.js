import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import "./styles/App.css";
import axios from "axios";
import NavigationBar from "./components/NavigationBar";
import Home from "./components/Home";
import UserComments from "./components/UserComments";
import ThreadList from "./components/ThreadList";
import ThreadComments from "./components/ThreadComments";
import About from "./components/About";
import UserList from "./components/UserList";
import SearchTermComments from "./components/SearchTermComments";

class App extends Component {
  state = {
    allUsers: [],
    // For filtering purposes, we use a separate variable to keep track of the currently filtered users.
    // And we keep allUsers as the "master list" for future filtering purposes.
    filteredUsers: [],
    // For the same reasoning as above, we use a separate variable to keep track of the currently filtered threads.
    filteredThreads: [],
    bucketedUsers: {},
    allThreads: [],
    commentsFromSearchTerm: [],
    commentsFromSpecificThread: [],
    commentsFromSpecificUser: [],
    currentlyDisplayedUser: null
  };

  mapSubredditToInt = {
    malefashionadvice: 0,
    femalefashionadvice: 1,
    streetwear: 2,
    goodyearwelt: 3,
    rawdenim: 4
  };

  // NOTE: These functions will replace the axios URL with a server when deployed.
  /* QUERY FUNCTIONS */
  /**
   * This function retrieves comments for a given user from the database.
   * @param {string} user The username to look up comments for.
   */
  getCommentsFromSpecificUser = user => {
    axios
      .get(`http://localhost:3001/u/${user}`)
      .then(res => {
        this.setState({
          commentsFromSpecificUser: res.data.commentsFromSpecificUser,
          currentlyDisplayedUser: user
        });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  /**
   * This function retrieves all users.
   */
  getAllUsers = () => {
    axios
      .get("http://localhost:3001/users")
      .then(res => {
        this.setState({
          allUsers: res.data.allUsers.sort((a, b) =>
            a.author_name > b.author_name ? 1 : -1
          ),
          filteredUsers: res.data.allUsers
        });
        this.bucketUsersByName();
      })
      .catch(err => console.log("Error: ", err.message));
  };

  /**
   * This function retrieves threads from a given subreddit from the database.
   * @param {string} subreddit The name of the subreddit to retrieve threads for.
   */
  getThreadsBySubreddit = subreddit => {
    let subredditToInt = this.mapSubredditToInt[subreddit];
    axios
      .get(`http://localhost:3001/r/${subredditToInt}`)
      .then(res => {
        this.setState({
          allThreads: res.data.subredditThreads,
          filteredThreads: res.data.subredditThreads
        });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  /**
   * This function retrieves the comments for a given thread detailed by the subreddit and YYYY/MM/DD it was created.
   * @param {string} subreddit Subreddit of thread to retrieve comments from.
   * @param {Number} year Four-digit number representing the year the thread was posted.
   * @param {Number} month One or two-digit number representing the month the thread was created.
   * @param {Number} day One or two-digit number representing the day the thread was created.
   */
  getCommentsOfThreadByThreadDate = (subreddit, year, month, day) => {
    /*
    Ensure that year, month, day are cast to Numbers
    Check if year, month, day are not NaN; if they are, return nothing
    */
    let subredditToInt = this.mapSubredditToInt[subreddit];
    axios
      .get(`http://localhost:3001/r/${subredditToInt}/${year}/${month}/${day}`)
      .then(res => {
        this.setState({
          commentsFromSpecificThread: res.data.commentsOfThreadByTimestamp
        });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  /**
   * This function retrieves the comments that contain the search term specified by the end user.
   * @param {string} searchTerm String to index comment table for comments containing specified search term.
   */
  getCommentsFromSearchTerm = searchTerm => {
    axios
      .get(`http://localhost:3001/comments/${searchTerm}`)
      .then(res => {
        this.setState({
          commentsFromSearchTerm: res.data.commentsFromSearchTerm
        });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  /* HELPER FUNCTIONS */
  sortDataByAscendingScore = nameOfData => {
    if (nameOfData === "userComments") {
      this.setState({
        commentsFromSpecificUser: this.state.commentsFromSpecificUser.sort(
          (a, b) => (a.commentScore > b.commentScore ? 1 : -1)
        )
      });
    } else if (nameOfData === "threadComments") {
      this.setState({
        commentsFromSpecificThread: this.state.commentsFromSpecificThread.sort(
          (a, b) => (a.commentScore > b.commentScore ? 1 : -1)
        )
      });
    } else if (nameOfData === "searchTermComments") {
      this.setState({
        commentsFromSearchTerm: this.state.commentsFromSearchTerm.sort((a, b) =>
          a.commentScore > b.commentScore ? 1 : -1
        )
      });
    }
  };

  sortDataByDescendingScore = nameOfData => {
    if (nameOfData === "userComments") {
      this.setState({
        commentsFromSpecificUser: this.state.commentsFromSpecificUser.sort(
          (a, b) => (a.commentScore < b.commentScore ? 1 : -1)
        )
      });
    } else if (nameOfData === "threadComments") {
      this.setState({
        commentsFromSpecificThread: this.state.commentsFromSpecificThread.sort(
          (a, b) => (a.commentScore < b.commentScore ? 1 : -1)
        )
      });
    } else if (nameOfData === "searchTermComments") {
      this.setState({
        commentsFromSearchTerm: this.state.commentsFromSearchTerm.sort((a, b) =>
          a.commentScore < b.commentScore ? 1 : -1
        )
      });
    }
  };

  sortDataByAscendingDate = nameOfData => {
    if (nameOfData === "userComments") {
      this.setState({
        commentsFromSpecificUser: this.state.commentsFromSpecificUser.sort(
          (a, b) => (a.commentTimestamp > b.commentTimestamp ? 1 : -1)
        )
      });
    } else if (nameOfData === "threadComments") {
      this.setState({
        commentsFromSpecificThread: this.state.commentsFromSpecificThread.sort(
          (a, b) => (a.commentTimestamp > b.commentTimestamp ? 1 : -1)
        )
      });
    } else if (nameOfData === "searchTermComments") {
      this.setState({
        commentsFromSearchTerm: this.state.commentsFromSearchTerm.sort((a, b) =>
          a.commentTimestamp > b.commentTimestamp ? 1 : -1
        )
      });
    }
  };

  sortDataByDescendingDate = nameOfData => {
    if (nameOfData === "userComments") {
      this.setState({
        commentsFromSpecificUser: this.state.commentsFromSpecificUser.sort(
          (a, b) => (a.commentTimestamp < b.commentTimestamp ? 1 : -1)
        )
      });
    } else if (nameOfData === "threadComments") {
      this.setState({
        commentsFromSpecificThread: this.state.commentsFromSpecificThread.sort(
          (a, b) => (a.commentTimestamp < b.commentTimestamp ? 1 : -1)
        )
      });
    } else if (nameOfData === "searchTermComments") {
      this.setState({
        commentsFromSearchTerm: this.state.commentsFromSearchTerm.sort((a, b) =>
          a.commentTimestamp < b.commentTimestamp ? 1 : -1
        )
      });
    }
  };

  /**
   * This function sorts users by the first letter of their name.
   * This function is used to optimally filter the users currently available for viewing on the UserList component.
   */
  bucketUsersByName = () => {
    let bucketedUsers = {
      a: [],
      b: [],
      c: [],
      d: [],
      e: [],
      f: [],
      g: [],
      h: [],
      i: [],
      j: [],
      k: [],
      l: [],
      m: [],
      n: [],
      o: [],
      p: [],
      q: [],
      r: [],
      s: [],
      t: [],
      u: [],
      v: [],
      w: [],
      x: [],
      y: [],
      z: [],
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      "-": [],
      _: []
    };
    for (const user of this.state.allUsers) {
      const firstLetter = user.author_name[0].toLowerCase();
      bucketedUsers[firstLetter].push(user);
    }
    this.setState({ bucketedUsers });
  };

  /**
   * This function takes in an array of characters representing the first letters of usernames that the end user wishes to see.
   * It uses the bucketedUsers state variable that is created upon the viewing of the program to create a subarray of users.
   * @param {array} letterFilters Array of characters used to determine which characters of users the end user wishes to view.
   */
  filterUsers = letterFilters => {
    // If the user de-selects every filter, display all of the usersnames.
    if (letterFilters.length === 0) {
      this.setState({ filteredUsers: this.state.allUsers });
    } else {
      // Else, combine each selected letter into a filtered array and replace that as the current list of filtered users.
      let currentlyFilteredUsers = [];
      for (const letterFilter of letterFilters) {
        currentlyFilteredUsers.push(this.state.bucketedUsers[letterFilter]);
      }
      // NOTE: We call .flat() because we are creating an array of arrays, when the table displaying users takes in a flattened/one-dimensional array.
      // We also sort the resulting array for easier viewability.
      this.setState({
        filteredUsers: currentlyFilteredUsers
          .flat()
          .sort((a, b) => (a.author_name > b.author_name ? 1 : -1))
      });
    }
  };

  /**
   * This function resets the currently filtered users to instead be all users.
   */
  resetFilteredUsers = () => {
    this.setState({ filteredUsers: this.state.allUsers });
  };

  /**
   * This function takes in two Date objects and filters the list of all threads to only contain those in the specified date range.
   * NOTE: Even though the inputs are Date objects, we can still apply mathematical functions on them in order to compare them with Unix timestamps.
   * @param {object} startDate Date object representing the start date of the filter range the end user specified.
   * @param {object} endDate Date object representing the end date of the filter range the end user specified.
   */
  filterThreads = (startDate, endDate) => {
    this.setState({
      filteredThreads: this.state.allThreads.filter(
        thread =>
          thread.thread_timestamp >= startDate / 1000 &&
          thread.thread_timestamp <= endDate / 1000
      )
    });
  };

  /**
   * This function resets the currently filtered threads to instead be all threads.
   */
  resetFilteredThreads = () => {
    this.setState({ filteredThreads: this.state.allThreads });
  };

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <NavigationBar
            getCommentsFromSpecificUser={this.getCommentsFromSpecificUser}
            getCommentsFromSearchTerm={this.getCommentsFromSearchTerm}
          />
          <Route exact path="/" render={props => <Home {...props} />} />
          <Route
            exact
            path="/u/:username"
            render={props => (
              <div
                className="text-center"
                id="username-displayer"
                style={{ paddingTop: "7.5px" }}
              >
                <div className="container" id="user-comments-container">
                  <UserComments
                    getCommentsFromSpecificUser={
                      this.getCommentsFromSpecificUser
                    }
                    commentsFromSpecificUser={
                      this.state.commentsFromSpecificUser
                    }
                    sortDataByAscendingScore={this.sortDataByAscendingScore}
                    sortDataByDescendingScore={this.sortDataByDescendingScore}
                    sortDataByAscendingDate={this.sortDataByAscendingDate}
                    sortDataByDescendingDate={this.sortDataByDescendingDate}
                    {...props}
                  />{" "}
                </div>
              </div>
            )}
          />
          <Route
            exact
            path="/r/:subreddit"
            render={props => (
              <div className="container" id="thread-list-container">
                <ThreadList
                  getThreadsBySubreddit={this.getThreadsBySubreddit}
                  filteredThreads={this.state.filteredThreads}
                  filterThreads={this.filterThreads}
                  resetFilteredThreads={this.resetFilteredThreads}
                  allThreads={this.state.allThreads}
                  {...props}
                />{" "}
              </div>
            )}
          />
          <Route
            path="/users"
            render={props => (
              <div className="container" id="user-list-container">
                <UserList
                  getAllUsers={this.getAllUsers}
                  filteredUsers={this.state.filteredUsers}
                  filterUsers={this.filterUsers}
                  resetFilteredUsers={this.resetFilteredUsers}
                  {...props}
                />{" "}
              </div>
            )}
          />
          <Route
            path="/r/:subreddit/:year/:month/:day"
            render={props => (
              <div
                className="text-center"
                id="username-displayer"
                style={{ paddingTop: "7.5px" }}
              >
                <div className="container" id="thread-displayer-container">
                  <ThreadComments
                    getCommentsOfThreadByThreadDate={
                      this.getCommentsOfThreadByThreadDate
                    }
                    commentsFromSpecificThread={
                      this.state.commentsFromSpecificThread
                    }
                    sortDataByAscendingScore={this.sortDataByAscendingScore}
                    sortDataByDescendingScore={this.sortDataByDescendingScore}
                    sortDataByAscendingDate={this.sortDataByAscendingDate}
                    sortDataByDescendingDate={this.sortDataByDescendingDate}
                    {...props}
                  />
                </div>
              </div>
            )}
          />
          <Route
            exact
            path="/comments/:searchTerm"
            render={props => (
              <div
                className="text-center"
                id="username-displayer"
                style={{ paddingTop: "7.5px" }}
              >
                <div className="container" id="user-comments-container">
                  <SearchTermComments
                    getCommentsFromSearchTerm={this.getCommentsFromSearchTerm}
                    commentsFromSearchTerm={this.state.commentsFromSearchTerm}
                    sortDataByAscendingScore={this.sortDataByAscendingScore}
                    sortDataByDescendingScore={this.sortDataByDescendingScore}
                    sortDataByAscendingDate={this.sortDataByAscendingDate}
                    sortDataByDescendingDate={this.sortDataByDescendingDate}
                    {...props}
                  />{" "}
                </div>
              </div>
            )}
          />
          <Route path="/about" component={About} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
