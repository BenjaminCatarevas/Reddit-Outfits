import React, { Component } from "react";
import { withRouter, BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import axios from "axios";
import UserComments from "./components/UserComments";
import NavigationBar from "./components/NavigationBar";
import About from "./components/About";
import ThreadList from "./components/ThreadList";
import UserList from "./components/UserList";
import ThreadDisplayer from "./components/ThreadDisplayer";

class App extends Component {
  state = {
    allUsers: null,
    allThreads: null,
    commentsFromSpecificUser: null,
    commentsFromSpecificThread: null,
    currentlyDisplayedUser: null
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
    axios
      .get(`http://localhost:3001/r/${subreddit}`)
      .then(res => {
        this.setState({ allThreads: res.data.subredditThreads });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  getCommentsOfThreadByThreadDate = (subreddit, year, month, day) => {
    axios
      .get(`http://localhost:3001/r/${subreddit}/${year}/${month}/${day}`)
      .then(res => {
        this.setState({
          commentsFromSpecificThread: res.data.commentsOfThreadByCommentId
        });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <h1 style={{ textAlign: "center", fontWeight: "bold" }}>
              <a style={{ color: "black", textDecoration: "none" }} href="/">
                Reddit Outfits
              </a>
            </h1>
            <h6 style={{ textAlign: "center", color: "#555" }}>
              View outfits, threads, and more of reddit's fashion communities
            </h6>
            <NavigationBar
              getCommentsFromSpecificUser={this.getCommentsFromSpecificUser}
              commentsFromSpecificUser={this.state.commentsFromSpecificUser}
              {...this.props}
            />
            <Route exact path="/" />
            <Route
              path="/u/:username"
              render={props => (
                <div className="text-center" style={{ paddingTop: "7.5px" }}>
                  <h6>
                    Posts by{" "}
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://reddit.com/u/${
                        this.state.currentlyDisplayedUser
                      }`}
                    >
                      /u/{this.state.currentlyDisplayedUser}
                    </a>
                  </h6>
                  <UserComments
                    getCommentsFromSpecificUser={
                      this.getCommentsFromSpecificUser
                    }
                    commentsFromSpecificUser={
                      this.state.commentsFromSpecificUser
                    }
                    {...props}
                  />{" "}
                </div>
              )}
            />
            <Route
              exact
              path="/r/:subreddit"
              render={props => (
                <div>
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
                <div>
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
                <div>
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
            <Route path="/about" component={About} />
          </div>
        </div>
      </Router>
    );
  }
}

export default withRouter(App);
