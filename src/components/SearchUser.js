import React, { Component } from 'react'
import PropTypes from 'prop-types';

export class SearchUser extends Component {
  state = {
      // We want to display what the user types in, so we have a state variable that changes as the user types stuff in.
      user: ''
  }

  onChange = (e) => {
      this.setState({ user: e.target.value })
  }

  onSubmit = (e) => {
      // So it doesn't submit right away.
      e.preventDefault();
      this.props.searchUser(this.state.user);
      this.setState({ user: '' });
  }
  
  render() {
    return (
        <div className="container">
                <form onSubmit={this.onSubmit} style={{display: 'flex'}}>
                    <input
                    type="text"
                    name="user"
                    style={{flex: '10', padding: '5px' }}
                    placeholder="Enter user..."
                    value={this.state.user}
                    onChange={this.onChange}
                    />
                    <input
                    type="submit"
                    value="Search"
                    className="btn-success"
                    style={{flex:'1'}}
                    />
                </form>
        </div>
    )
  }
}

SearchUser.propTypes = {
    searchUser: PropTypes.func.isRequired,
  }

export default SearchUser
