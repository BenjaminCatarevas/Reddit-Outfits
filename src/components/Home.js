import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

export class Home extends Component {
  state = {
    threadsMenuAnchorEl: null
  };

  threads = [
    {
      display: "MaleFashionAdvice",
      link: "malefashionadvice"
    },
    {
      display: "FemaleFashionAdvice",
      link: "femalefashionadvice"
    },
    {
      display: "Streetwear",
      link: "streetwear"
    },
    {
      display: "RawDenim",
      link: "rawdenim"
    },
    {
      display: "GoodYearWelt",
      link: "goodyearwelt"
    }
  ];

  /**
   * This function sets the state of the menu to be closed.
   * Adatped from: https://material-ui.com/components/menus/
   */
  closeThreadsMenu() {
    this.setState({ threadsMenuAnchorEl: null });
  }

  /**
   * This function sets the state of the subreddit chosen from the Threads menu on the landing page.
   * @param {object} e Event object representing the element clicked on the landing page Threads menu.
   */
  handleThreadsMenuClick(e) {
    this.setState({ threadsMenuAnchorEl: e.currentTarget });
  }

  render() {
    return (
      <div>
        <div className="textContainer">
          <h1 style={headerStyle}>
            <Link to="/" style={linkHeaderStyle}>
              Reddit Outfits
            </Link>
          </h1>
          <h6 style={subtextHeaderStyle}>
            View outfits, threads, and more of reddit's fashion communities
          </h6>
        </div>
        <div style={buttonsContainerStyle}>
          <Link to="/users">
            <Button
              variant="contained"
              color="primary"
              className={this.props.classes.button}
            >
              Users
            </Button>
          </Link>
          <Button
            variant="contained"
            color="primary"
            className={this.props.classes.button}
            onClick={this.handleThreadsMenuClick.bind(this)}
          >
            Threads
          </Button>
          <Menu
            anchorEl={this.state.threadsMenuAnchorEl}
            open={Boolean(this.state.threadsMenuAnchorEl)}
            onClose={this.closeThreadsMenu.bind(this)}
          >
            {this.threads.map(thread => (
              <MenuItem
                component={Link}
                key={thread.display}
                to={"/r/" + thread.link}
                onClick={this.closeThreadsMenu.bind(this)}
              >
                {thread.display}
              </MenuItem>
            ))}
          </Menu>
          <Link to="/stats">
            <Button
              variant="contained"
              color="primary"
              className={this.props.classes.button}
            >
              Stats [WIP]
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

const headerStyle = {
  textAlign: "center"
};

const subtextHeaderStyle = {
  color: "#555",
  textAlign: "center"
};

const linkHeaderStyle = {
  color: "black",
  textDecoration: "none",
  fontWeight: "500px"
};

const buttonsContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const classes = theme => ({
  button: {
    margin: theme.spacing(1)
  }
});

export default withRouter(withStyles(classes)(Home));
