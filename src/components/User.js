import React, { Component } from 'react'

export class User extends Component {
    render() {
        return (
        <div>
            {console.log(this.props.userInformation)}
        </div>
        )
    }
}

export default User
