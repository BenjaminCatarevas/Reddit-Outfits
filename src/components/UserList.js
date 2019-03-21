import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import UserListItem from "./UserListItem";

export class UserList extends Component {
  // Add function for end-user specifying a username and act accordingly (redirect)

  componentDidMount() {
    this.props.getAllUsers();
  }

  render() {
    // If the users state is null, return an empty div, else return User components for each user.
    return this.props.allUsers ? (
      this.props.allUsers.map(user => {
        return (
          <div key={user.author_name} className="row">
            <div className="container">
              <UserListItem userInformation={user} />
            </div>
          </div>
        );
      })
    ) : (
      <div />
    );
  }
}

UserList.propTypes = {
  getAllUsers: PropTypes.func.isRequired
};

export default withRouter(UserList);
