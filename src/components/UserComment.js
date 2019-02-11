import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

export class UserComment extends Component {
  render() {
    return (
      <div>
        {console.log(this.props.userInformation)}
      </div>
    )
  }
}

export default withRouter(UserComment)
