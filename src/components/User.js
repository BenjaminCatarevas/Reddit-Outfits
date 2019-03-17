import React, { Component } from "react";
import { withRouter } from "react-router-dom";

export class User extends Component {
  render() {
    // This will be the component displayed by the Users component
    // It contains info like score, etc.
    // It will link to a user's page
    /*
        {author_name: "test", num_comments: 1}
        author_name: "test"
        num_comments: 1
        */
    return (
      <div>
        {console.log(this.props.userInformation)}
        <a
          href={`http://localhost:3000/u/${
            this.props.userInformation.author_name
          }`}
        >
          {this.props.userInformation.author_name}
        </a>
      </div>
    );
  }
}

export default withRouter(User);
