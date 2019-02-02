import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class UserComment extends Component {
  render() {
    return (
      <div>
        {console.log(this.props.comment)}
      </div>
    )
  }
}

UserComment.propTypes = {
  comment: PropTypes.object.isRequired,
}

export default UserComment
