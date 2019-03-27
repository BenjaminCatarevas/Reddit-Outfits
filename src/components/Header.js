import React, { Component } from "react";
import NavigationBar from "./NavigationBar";
import { Link, withRouter } from "react-router-dom";

export class Header extends Component {
  render() {
    return (
      <div>
        <h1 style={textHeaderStyle}>
          <Link to="/" style={linkHeaderStyle}>
            Reddit Outfits
          </Link>
        </h1>
        <h6 style={subtextHeaderStyle}>
          View outfits, threads, and more of reddit's fashion communities
        </h6>
        <NavigationBar
          getCommentsFromSpecificUser={this.props.getCommentsFromSpecificUser}
          commentsFromSpecificUser={this.props.commentsFromSpecificUser}
          {...this.props}
        />
      </div>
    );
  }
}

const textHeaderStyle = {
  textAlign: "center"
};

const subtextHeaderStyle = {
  textAlign: "center",
  color: "#555"
};

const linkHeaderStyle = {
  color: "black",
  textDecoration: "none",
  fontWeight: "500px"
};

export default withRouter(Header);
