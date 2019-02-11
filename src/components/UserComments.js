import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import UserComment from './UserComment';

export class UserComments extends Component {

    componentDidMount() {
        this.props.getSpecificUserComments(this.props.match.params.username);
    }
  
    render() {
        // Shortener to avoid using this.props.specificUserComments everywhere.
        let specificUserComments = this.props.specificUserComments;
        // Object mapping approach adapted from: https://stackoverflow.com/a/39965962
        // If the specificUserComments is null, just return an empty div. Otherwise, create a UserComment component for each comment.
        return specificUserComments ? Object.keys(specificUserComments).map((key) => {
            return <UserComment key={key} userInformation={specificUserComments[key]} />
        }) : <div></div>
    }
}

export default withRouter(UserComments)
