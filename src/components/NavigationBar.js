import React from "react";
import { Link } from "react-router-dom";

export default function NavigationBar() {
  return (
    <header style={navBarStyle}>
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
  background: "#fff",
  textAlign: "center",
  padding: "10px",
  border: "2px solid #b8e0d3",
  borderRadius: "5px solid #b8e0d3",
  margin: "5px"
};

const linkStyle = {
  color: "#333",
  textDecoration: "none"
};
