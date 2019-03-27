import React, { Component } from "react";
import NavigationBar from "./NavigationBar";

export class Header extends Component {
  render() {
    return (
      <div>
        <h1 style={textHeaderStyle}>
          <a
            style={{
              color: "black",
              textDecoration: "none",
              fontWeight: "500px"
            }}
            href="/"
          >
            Reddit Outfits
          </a>
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

export default Header;
