import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import MaterialTable from "material-table";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

export class UserList extends Component {
  // Add function for end-user specifying a username and act accordingly (redirect)

  componentDidMount() {
    this.props.getAllUsers();
  }

  state = {
    letterFilters: []
  };

  handleFormat = (event, newLetterFilters) => {
    console.log(newLetterFilters);
    this.setState({ letterFilters: newLetterFilters });
    this.props.filterUsers(newLetterFilters);
  };

  render() {
    const { filteredUsers } = this.props;
    const usernameCharacters = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "-",
      "_"
    ];
    // If the users state is null, return an empty div, else display tabularized users.
    return filteredUsers.length !== 0 ? (
      <div>
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
          data={filteredUsers}
          options={{ search: true }}
        />
        <ToggleButtonGroup
          value={this.state.letterFilters}
          onChange={this.handleFormat}
          aria-label="text formatting"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {usernameCharacters.map(character => {
            return (
              <ToggleButton
                value={character}
                aria-label={character}
                key={character}
              >
                <b>{character.toUpperCase()}</b>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </div>
    ) : (
      <div />
    );
  }
}

UserList.propTypes = {
  getAllUsers: PropTypes.func.isRequired,
  filteredUsers: PropTypes.array.isRequired,
  filterUsers: PropTypes.func.isRequired
};

export default withRouter(UserList);
