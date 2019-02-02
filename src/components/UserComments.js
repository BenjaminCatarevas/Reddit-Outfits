import React, { Component } from 'react'
import UserComment from './UserComment';

export class UserComments extends Component {

    componentDidMount() {
        this.props.getSpecificUserComments(this.props.match.params.username);
    }
  
    render() {
        console.log(typeof this.props.specificUserComments);
        // If the specific user comments state is null, return an empty div, else return UserComment components for each comment.
        return this.props.specificUserComments ? this.props.specificUserComments.map((comment) => {
            return <UserComment key={comment.author_name} userInformation={comment} />
        }) : <div></div>
    }
}

export default UserComments
