import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

export class SearchUser extends Component {
  state = {
    // We want to display what the user types in, so we have a state variable that changes as the user types stuff in.
    user: ""
  };

  onChange = e => {
    this.setState({ user: e.target.value });
  };

  onSubmit = e => {
    // So it doesn't submit right away.
    e.preventDefault();
    // Only submit if non-empty username.
    if (this.state.user) {
      this.props.history.push(`/u/${this.state.user}`);
      this.props.getSpecificUserComments(this.state.user);
      this.setState({ user: "" });
    }
  };

  render() {
    return (
      <div className="container">
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="user"
            className="form-control"
            placeholder="Enter user..."
            value={this.state.user}
            onChange={this.onChange}
          />
          <input type="submit" value="Search" />
        </form>
      </div>
    );
  }
}

SearchUser.propTypes = {
  getSpecificUserComments: PropTypes.func.isRequired
};

export default withRouter(SearchUser);
