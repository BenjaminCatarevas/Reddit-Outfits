import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import MaterialTable from "material-table";
import { Link } from "react-router-dom";

export class UserList extends Component {
  // Add function for end-user specifying a username and act accordingly (redirect)

  componentDidMount() {
    this.props.getAllUsers();
  }

  render() {
    const { allUsers } = this.props;
    // If the users state is null, return an empty div, else display tabularized users.
    return allUsers ? (
      <MaterialTable
        title="Users"
        columns={[
          {
            title: "Username",
            field: "author_name",
            render: rowData => (
              <Link to={`/u/${rowData.author_name}`}>
                {rowData.author_name}
              </Link>
            )
          },
          { title: "Number of comments", field: "num_comments" },
          { title: "Number of outfits", field: "num_outfits" }
        ]}
        data={allUsers}
        options={{ search: true }}
      />
    ) : (
      <div />
    );
  }
}

UserList.propTypes = {
  getAllUsers: PropTypes.func.isRequired
};

export default withRouter(UserList);
