import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import MaterialTable from "material-table";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

export class UserList extends Component {
  // Add function for end-user specifying a username and act accordingly (redirect)

  componentDidMount() {
    this.props.getAllUsers();
  }

  state = {
    letterFilters: []
  };

  /**
   * This function takes in an array of letter filters chosen by the end user and updates the state with this selection.
   * This function then calls the App.js-level function to filter the users based on this selection.
   * @param {object} event Event object.
   * @param {array} newLetterFilters Array of letter filters selected by end user.
   */
  handleFormat = (event, newLetterFilters) => {
    this.setState({ letterFilters: newLetterFilters });
    this.props.filterUsers(newLetterFilters);
  };

  /**
   * This function resets the letter filters to be an empty array, thus indicating no filters are selected.
   * This function then calls the App.js-level function to reset the currently filtered users to instead be all users.
   */
  resetFilters = () => {
    this.setState({ letterFilters: [] });
    this.props.resetFilteredUsers();
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
    // If the list of users available is empty, return a loading bar, else display tabularized users.
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
                style={{ margin: "2px" }}
              >
                <b>{character.toUpperCase()}</b>
              </ToggleButton>
            );
          })}
          <Button
            variant="contained"
            color="primary"
            onClick={this.resetFilters}
            style={{ margin: "2px" }}
          >
            Reset
          </Button>
        </ToggleButtonGroup>
      </div>
    ) : (
      <CircularProgress />
    );
  }
}

UserList.propTypes = {
  getAllUsers: PropTypes.func.isRequired,
  filteredUsers: PropTypes.array.isRequired,
  filterUsers: PropTypes.func.isRequired
};

export default withRouter(UserList);
