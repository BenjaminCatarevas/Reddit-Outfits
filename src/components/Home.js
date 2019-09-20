import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

export class Home extends Component {
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
          <Link to="/threads">
            <Button
              variant="contained"
              color="primary"
              className={this.props.classes.button}
            >
              Threads
            </Button>
          </Link>
          <Link to="/stats">
            <Button
              variant="contained"
              color="primary"
              className={this.props.classes.button}
            >
              Stats
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
