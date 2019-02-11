import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

export class Thread extends Component {
    render() {
        return (
        <div>
            {console.log(this.props)}
        </div>
        )
    }
}

export default withRouter(Thread)
