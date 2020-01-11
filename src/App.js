import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import "./styles/App.css";
import axios from "axios";
import NavigationBar from "./components/NavigationBar";
import Home from "./components/Home";
import UserComments from "./components/UserComments";
import ThreadList from "./components/ThreadList";
import ThreadDisplayer from "./components/ThreadDisplayer";
import Stats from "./components/Stats";
import About from "./components/About";
import UserList from "./components/UserList";

class App extends Component {
  state = {
    allUsers: [],
    allThreads: [],
    commentsFromSpecificUser: [],
    commentsFromSpecificThread: [],
    currentlyDisplayedUser: null
  };

  mapSubredditToInt = {
    malefashionadvice: 0,
    femalefashionadvice: 1,
    streetwear: 2,
    goodyearwelt: 3,
    rawdenim: 4
  };

  // NOTE: These functions will replace the axios URL with a server.
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

  getAllUsers = () => {
    axios
      .get("http://localhost:3001/users")
      .then(res => {
        this.setState({ allUsers: res.data.allUsers });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  getAllThreads = () => {
    axios
      .get("http://localhost:3001/threads")
      .then(res => {
        this.setState({ allThreads: res.data.allThreads });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  getThreadsBySubreddit = subreddit => {
    let subredditToInt = this.mapSubredditToInt[subreddit];
    axios
      .get(`http://localhost:3001/r/${subredditToInt}`)
      .then(res => {
        this.setState({ allThreads: res.data.subredditThreads });
      })
      .catch(err => console.log("Error: ", err.message));
  };

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
          commentsFromSpecificThread: res.data.commentsOfThreadByCommentId
        });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  sortCommentsFromSpecificUserByAscendingScore = () => {
    this.setState({
      commentsFromSpecificUser: this.state.commentsFromSpecificUser.sort(
        (a, b) => (a.commentScore > b.commentScore ? 1 : -1)
      )
    });
  };

  sortCommentsFromSpecificUserByDescendingScore = () => {
    this.setState({
      commentsFromSpecificUser: this.state.commentsFromSpecificUser.sort(
        (a, b) => (a.commentScore < b.commentScore ? 1 : -1)
      )
    });
  };

  sortCommentsFromSpecificUserByAscendingDate = () => {
    this.setState({
      commentsFromSpecificUser: this.state.commentsFromSpecificUser.sort(
        (a, b) => (a.commentTimestamp > b.commentTimestamp ? 1 : -1)
      )
    });
  };

  sortCommentsFromSpecificUserByDescendingDate = () => {
    this.setState({
      commentsFromSpecificUser: this.state.commentsFromSpecificUser.sort(
        (a, b) => (a.commentTimestamp < b.commentTimestamp ? 1 : -1)
      )
    });
  };

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <NavigationBar
            getCommentsFromSpecificUser={this.getCommentsFromSpecificUser}
          />
          <Route exact path="/" render={props => <Home {...props} />} />
          <Route
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
                    sortCommentsFromSpecificUserByAscendingScore={
                      this.sortCommentsFromSpecificUserByAscendingScore
                    }
                    sortCommentsFromSpecificUserByDescendingScore={
                      this.sortCommentsFromSpecificUserByDescendingScore
                    }
                    sortCommentsFromSpecificUserByAscendingDate={
                      this.sortCommentsFromSpecificUserByAscendingDate
                    }
                    sortCommentsFromSpecificUserByDescendingDate={
                      this.sortCommentsFromSpecificUserByDescendingDate
                    }
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
                  getAllThreads={this.getAllThreads}
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
                  allUsers={this.state.allUsers}
                  {...props}
                />{" "}
              </div>
            )}
          />
          <Route
            path="/r/:subreddit/:year/:month/:day"
            render={props => (
              <div className="container" id="thread-displayer-container">
                <ThreadDisplayer
                  getCommentsOfThreadByThreadDate={
                    this.getCommentsOfThreadByThreadDate
                  }
                  commentsFromSpecificThread={
                    this.state.commentsFromSpecificThread
                  }
                  {...props}
                />
              </div>
            )}
          />
          <Route
            path="/stats"
            render={props => (
              <div>
                <Stats
                  getAllThreads={this.getAllThreads}
                  allThreads={this.state.allThreads}
                  {...props}
                />
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
