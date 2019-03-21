import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

export class UserListItem extends Component {
  render() {
    const { userInformation } = this.props;
    // This will be the component displayed by the Users component
    // It contains info like score, etc.
    // It will link to a user's page
    return (
      <h6 style={userStyle}>
        <a href={`http://localhost:3000/u/${userInformation.author_name}`}>
          {userInformation.author_name}
        </a>
      </h6>
    );
  }
}

const userStyle = {
  width: "75%",
  margin: "0 auto"
};

UserListItem.propTypes = {
  userInformation: PropTypes.object.isRequired
};

export default withRouter(UserListItem);
