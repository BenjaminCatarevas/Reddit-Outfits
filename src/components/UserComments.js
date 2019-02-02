import React, { Component } from 'react'
import axios from 'axios';

export class UserComments extends Component {
  state = {
      data: null,
  }

  componentDidMount() {
    axios.get(`http://localhost:3001/u/${this.props.match.params.username}`)
    .then(res => {this.setState({ data: res.data, })})
    .catch('pri nt')
  }
  
  render() {
    return (
      <div>
          {console.log(this.state)}
      </div>
    )
  }
}

export default UserComments
