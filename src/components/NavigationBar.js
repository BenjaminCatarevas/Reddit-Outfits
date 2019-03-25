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
            <Nav fill variant="tabs" className="mr-auto">
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
              <Button type="submit" variant="outline-success">
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
  border: "2px solid #b8e0d3",
  borderRadius: "10px solid #b8e0d3",
  width: "75%",
  margin: "0 auto"
};

export default withRouter(NavigationBar);
