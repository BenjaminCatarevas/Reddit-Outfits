import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./styles/App.css";
import axios from "axios";
import Header from "./components/Header";
import Routing from "./components/Routing";

class App extends Component {
  state = {
    allUsers: null,
    allThreads: null,
    commentsFromSpecificUser: null,
    commentsFromSpecificThread: null,
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
    //TODO: Find way to sort object of objects and maintain the same structure
  };

  sortCommentsFromSpecificUserByDescendingScore = () => {
    //TODO: Find way to sort object of objects and maintain the same structure
  };

  sortCommentsFromSpecificUserByAscendingDate = () => {
    //TODO: Find way to sort object of objects and maintain the same structure
  };

  sortCommentsFromSpecificUserByDescendingDate = () => {
    //TODO: Find way to sort object of objects and maintain the same structure
  };

  render() {
    return (
      <div className="App">
        <div className="container" id="app-container">
          <Header
            getCommentsFromSpecificUser={this.getCommentsFromSpecificUser}
            commentsFromSpecificUser={this.state.commentsFromSpecificUser}
          />
          <Routing
            getCommentsFromSpecificUser={this.getCommentsFromSpecificUser}
            commentsFromSpecificUser={this.state.commentsFromSpecificUser}
            getThreadsBySubreddit={this.getThreadsBySubreddit}
            getAllThreads={this.getAllThreads}
            getAllUsers={this.getAllUsers}
            allUsers={this.state.allUsers}
            commentsFromSpecificThread={this.state.commentsFromSpecificThread}
            allThreads={this.state.allThreads}
            getCommentsOfThreadByThreadDate={
              this.getCommentsOfThreadByThreadDate
            }
            sortCommentsFromSpecificUserByAscendingScore={
              this.sortCommentsFromSpecificUserByAscendingScore
            }
          />
        </div>
      </div>
    );
  }
}

export default withRouter(App);
