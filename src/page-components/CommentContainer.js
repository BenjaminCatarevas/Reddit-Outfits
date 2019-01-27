import React, { Component } from 'react';
import UserComment from './UserComment';
import PropTypes from 'prop-types';

export class CommentContainer extends Component {
  render() {
    return (
      <div>
        {this.props.comments.map((comment) => {
          return <UserComment key={comment.commentId} comment={comment}/>
        })}
      </div>
    )
  }
}

CommentContainer.proptypes = {
  comments: PropTypes.array.isRequired,
}

export default CommentContainer
