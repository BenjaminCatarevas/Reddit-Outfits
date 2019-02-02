import React, { Component } from 'react'
import User from './User';

export class Users extends Component {

    componentDidMount() {
        this.props.getAllUsers();
    }

    render() {
        // If the users state is null, return an empty div, else return User components for each user.
        return this.props.allUsers ? this.props.allUsers.map((user) => {
            return <User key={user.author_name} userInformation={user} />
        }) : <div></div>
    }
}

export default Users
