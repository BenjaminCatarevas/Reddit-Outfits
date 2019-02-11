import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

export class User extends Component {
    render() {
        return (
        <div>
            {console.log(this.props.userInformation)}
        </div>
        )
    }
}

export default withRouter(User)
