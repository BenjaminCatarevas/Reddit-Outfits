import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import MaterialTable from "material-table";

export class UserList extends Component {
  // Add function for end-user specifying a username and act accordingly (redirect)

  componentDidMount() {
    this.props.getAllUsers();
  }

  render() {
    const { allUsers } = this.props;
    // If the users state is null, return an empty div, else display tabularized users.
    return allUsers.length !== 0 ? (
      <MaterialTable
        title="Users"
        columns={[
          {
            title: "Reddit Outfits Profile Link",
            field: "author_name",
            render: rowData => (
              <Link to={`/u/${rowData.author_name}`}>
                {rowData.author_name}
              </Link>
            )
          },
          { title: "Number of comments", field: "num_comments" },
          { title: "Number of outfit images", field: "num_outfits" },
          {
            title: "Reddit Profile Link",
            field: "author_name",
            render: rowData => (
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={"https://reddit.com/u/" + rowData.author_name}
              >
                /u/{rowData.author_name}
              </a>
            )
          }
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
  getAllUsers: PropTypes.func.isRequired,
  allUsers: PropTypes.array.isRequired
};

export default withRouter(UserList);
