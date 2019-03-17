import React from "react";
import { Link } from "react-router-dom";

export default function NavigationBar() {
  return (
    <header style={navBarStyle}>
      <h1>Reddit Outfits</h1>
      <Link style={linkStyle} to="/">
        Home
      </Link>{" "}
      |
      <Link style={linkStyle} to="/users">
        {" "}
        Users
      </Link>{" "}
      |
      <Link style={linkStyle} to="/threads">
        {" "}
        Threads
      </Link>{" "}
      |
      <Link style={linkStyle} to="/about">
        {" "}
        About
      </Link>
    </header>
  );
}

const navBarStyle = {
  background: "#333",
  color: "#fff",
  textAlign: "center",
  padding: "10px"
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none"
};
