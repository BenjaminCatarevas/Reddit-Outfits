import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export class HomePageButton extends Component {
  render() {
    return (
      <div style={homePageButtonStyle}>
        <LinkContainer to={this.props.directTo}>
          <Button variant="dark">{this.props.displayText}</Button>
        </LinkContainer>
      </div>
    );
  }
}

const homePageButtonStyle = {
  padding: "10px",
  display: "block"
};

export default HomePageButton;
