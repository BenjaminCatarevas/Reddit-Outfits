import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import UserComments from "./UserComments";
import About from "./About";
import ThreadList from "./ThreadList";
import UserList from "./UserList";
import ThreadDisplayer from "./ThreadDisplayer";
import Error from "./Error";
import { Switch, withRouter, Route } from "react-router-dom";
import Stats from "./Stats";
import Home from "./Home";
import "../styles/Routing.css";

function Routing({
  location,
  getAllUsers,
  allUsers,
  getAllThreads,
  allThreads,
  getThreadsBySubreddit,
  getCommentsFromSpecificUser,
  commentsFromSpecificUser,
  getCommentsOfThreadByThreadDate,
  commentsFromSpecificThread,
  sortCommentsFromSpecificUserByAscendingScore,
  sortCommentsFromSpecificUserByDescendingScore,
  sortCommentsFromSpecificUserByAscendingDate,
  sortCommentsFromSpecificUserByDescendingDate
}) {
  return (
    // Transition sourced from: https://medium.com/@khwsc1/step-by-step-guide-of-simple-routing-transition-effect-for-react-with-react-router-v4-and-9152db1566a0
    <div>
      <TransitionGroup
        className="transition-group"
        style={{ position: "relative" }}
      >
        <CSSTransition
          key={location.key}
          timeout={{ enter: 200, exit: 200 }}
          classNames={"fade"}
        >
          <section className="route-selection" style={sectionStyle}>
            <Switch location={location}>
              <Route exact path="/" render={props => <Home />} />
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
                          getCommentsFromSpecificUser
                        }
                        commentsFromSpecificUser={commentsFromSpecificUser}
                        sortCommentsFromSpecificUserByAscendingScore={
                          sortCommentsFromSpecificUserByAscendingScore
                        }
                        sortCommentsFromSpecificUserByDescendingScore={
                          sortCommentsFromSpecificUserByDescendingScore
                        }
                        sortCommentsFromSpecificUserByAscendingDate={
                          sortCommentsFromSpecificUserByAscendingDate
                        }
                        sortCommentsFromSpecificUserByDescendingDate={
                          sortCommentsFromSpecificUserByDescendingDate
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
                      getThreadsBySubreddit={getThreadsBySubreddit}
                      getAllThreads={getAllThreads}
                      allThreads={allThreads}
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
                      getAllUsers={getAllUsers}
                      allUsers={allUsers}
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
                        getCommentsOfThreadByThreadDate
                      }
                      commentsFromSpecificThread={commentsFromSpecificThread}
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
                      getAllThreads={getAllThreads}
                      allThreads={allThreads}
                      {...props}
                    />
                  </div>
                )}
              />
              <Route path="/about" component={About} />
              <Route component={Error} />
            </Switch>
          </section>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

const sectionStyle = {
  position: "absolute",
  width: "100%",
  top: "0",
  left: "0"
};

export default withRouter(Routing);
