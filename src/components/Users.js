import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import User from "./User";

export class Users extends Component {
  // Add function for end-user specifying a username and act accordingly (redirect)

  componentDidMount() {
    this.props.getAllUsers();
  }

  render() {
    // If the users state is null, return an empty div, else return User components for each user.
    return this.props.allUsers ? (
      this.props.allUsers.map(user => {
        return <User key={user.author_name} userInformation={user} />;
      })
    ) : (
      <div />
    );
  }
}

export default withRouter(Users);
