import React, { Component } from "react";

export class Error extends Component {
  render() {
    return (
      <div style={errorContainerStyle}>
        <h3>Error: Information not found.</h3>
      </div>
    );
  }
}

const errorContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

export default Error;
