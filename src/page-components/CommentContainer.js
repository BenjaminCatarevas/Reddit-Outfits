import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class CommentContainer extends Component {
  render() {
    return (
      <div>
        {this.props.comments.map((comment) => {
          return <Comment key={comment.commentId} comment={comment}/>
        })}
      </div>
    )
  }
}

CommentContainer.proptypes = {
  comments: PropTypes.object.isRequired,
}

export default CommentContainer
