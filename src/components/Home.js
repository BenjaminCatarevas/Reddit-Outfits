import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

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

export default withRouter(Home);
