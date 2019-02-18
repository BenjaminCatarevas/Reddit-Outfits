import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

export class SearchUser extends Component {
  state = {
      // We want to display what the user types in, so we have a state variable that changes as the user types stuff in.
      user: '',
  }

  onChange = (e) => {
      this.setState({ user: e.target.value });
  }

  onSubmit = (e) => {
      // So it doesn't submit right away.
      e.preventDefault();
      this.props.history.push(`/u/${this.state.user}`);
      this.props.getSpecificUserComments(this.state.user);
      this.setState({ user: '' });
  }
  
  render() {
      // If the path is either home or users, display the search bar. Else, don't display.
      // We use unacceptable paths because the path /u/${username} is unmatchable.
      // If the current path is not an unacceptable path, we display the search bar.
      return !this.props.unacceptablePaths.includes(this.props.location.pathname) ? 
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
        </div> : <div></div>
    }
}

SearchUser.propTypes = {
    getSpecificUserComments: PropTypes.func.isRequired,
  }

export default withRouter(SearchUser)
