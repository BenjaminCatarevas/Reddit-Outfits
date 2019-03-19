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

export class NavigationBar extends Component {
  state = {
    // We want to display what the user types in, so we have a state variable that changes as the user types stuff in.
    user: ""
  };

  onChange = e => {
    this.setState({ user: e.target.value });
  };

  onSubmit = e => {
    // So it doesn't submit right away.
    e.preventDefault();
    // Only submit if non-empty username.
    if (this.state.user) {
      this.props.history.push(`/u/${this.state.user}`);
      this.props.getSpecificUserComments(this.state.user);
      this.setState({ user: "" });
    }
  };

  render() {
    return (
      // Source: https://react-bootstrap.github.io/components/navbar/
      <div>
        <Navbar style={navBarStyle} bg="white" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/users">Users</Nav.Link>
              <NavDropdown title="Threads" id="basic-nav-dropdown">
                <NavDropdown.Item href="/r/malefashionadvice">
                  MaleFashionAdvice
                </NavDropdown.Item>
                <NavDropdown.Item href="/r/femalefashionadvice">
                  FemaleFashionAdvice
                </NavDropdown.Item>
                <NavDropdown.Item href="/r/streetwear">
                  Streetwear
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="#githublink">Github</Nav.Link>
            </Nav>
            <Form onSubmit={this.onSubmit} inline>
              <FormControl
                type="text"
                placeholder="Enter user..."
                value={this.state.user}
                onChange={this.onChange}
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
