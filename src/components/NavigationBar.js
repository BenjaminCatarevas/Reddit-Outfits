import React, { Component } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  FormControl
} from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Select from "react-select";

//TODO: Embed react-select in navbar?: https://react-select.com/components
// https://github.com/JedWatson/react-select
// https://www.youtube.com/watch?v=1iysNUrI3lw

import { LinkContainer } from "react-router-bootstrap";

export class NavigationBar extends Component {
  state = {
    // We want to display what the user types in, so we have a state variable that changes as the user types stuff in.
    user: ""
  };

  onSearchUserBarChange = e => {
    this.setState({ user: e.target.value });
  };

  onSearchUserBarSubmit = e => {
    // So it doesn't submit right away.
    e.preventDefault();
    // Only submit if non-empty username.
    if (this.state.user) {
      this.props.history.push(`/u/${this.state.user}`);
      this.props.getCommentsFromSpecificUser(this.state.user);
      this.setState({ user: "" });
    }
  };

  render() {
    return (
      // Source: https://react-bootstrap.github.io/components/navbar/
      <div id="navbar-container">
        <Navbar style={navBarStyle} bg="white" expand="xl">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer exact to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/users">
                <Nav.Link>Users</Nav.Link>
              </LinkContainer>
              <NavDropdown title="Threads" id="basic-nav-dropdown">
                <LinkContainer to="/r/malefashionadvice">
                  <NavDropdown.Item>MaleFashionAdvice</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/r/femalefashionadvice">
                  <NavDropdown.Item>FemaleFashionAdvice</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/r/streetwear">
                  <NavDropdown.Item>Streetwear</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <LinkContainer to="/about">
                <Nav.Link>About</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/stats">
                <Nav.Link>Stats</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/github">
                <Nav.Link>Github</Nav.Link>
              </LinkContainer>
            </Nav>
            <Form onSubmit={this.onSearchUserBarSubmit} inline>
              <FormControl
                type="text"
                placeholder="Enter user..."
                value={this.state.user}
                onChange={this.onSearchUserBarChange}
                className="mr-sm-2"
              />
              <Button type="submit" variant="outline-dark">
                Search
              </Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

const navBarStyle = {
  border: "2px solid #333",
  margin: "0 auto"
};

export default withRouter(NavigationBar);
