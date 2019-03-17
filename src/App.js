import React, { Component } from 'react';
import { withRouter, BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import SearchUser from './components/SearchUser'
import UserComments from './components/UserComments';
import NavigationBar from './components/NavigationBar';
import About from './components/About';
import Threads from './components/Threads';
import Users from './components/Users';

class App extends Component {
    state = {
        allUsers: null,
        allThreads: null,
        specificUserComments: null,
    }

    // NOTE: These functions will replace the axios URL with a server.
    getSpecificUserComments = (user) => {
        axios.get(`http://localhost:3001/u/${user}`)
        .then(res => {this.setState({ specificUserComments: res.data.specificUserComments })})
        .catch((err) => console.log('Error: ', err.message))
    }

    getAllUsers = () => {
        axios.get('http://localhost:3001/users')
        .then((res) => {this.setState({ allUsers: res.data.allUsers })})
        .catch((err) => console.log('Error: ', err.message))
    }
    
    getAllThreads = () => {
        axios.get('http://localhost:3001/threads')
        .then((res) => {this.setState({ allThreads: res.data.allThreads })})
        .catch((err) => console.log('Error: ', err.message))
    }

    getSubredditThreads = (subreddit) => {
        axios.get(`http://localhost:3001/r/${subreddit}`)
        .then((res) => {this.setState({ allThreads: res.data.subredditThreads })})
        .catch((err) => console.log('Error: ', err.message))
    }

    render() {
        return (
        <Router>
            <div className="App">
                <div className="container">
                    <NavigationBar/>                   
                    <SearchUser getSpecificUserComments={this.getSpecificUserComments} specificUserComments={this.state.specificUserComments} {...this.props} />
                    <Route exact path="/" {...this.props} />
                    <Route path="/u/:username" render = {(props) => <div><UserComments getSpecificUserComments={this.getSpecificUserComments} specificUserComments={this.state.specificUserComments} {...props}/> </div>} /> 
                    <Route path="/r/:subreddit?" render = {(props) => <div><Threads getSpecificThreads={this.getSubredditThreads} getAllThreads={this.getAllThreads} allThreads={this.state.allThreads} {...props}/> </div>} />
                    <Route path="/users" render = {(props) => <div><Users getAllUsers={this.getAllUsers} allUsers={this.state.allUsers} {...props}/> </div>} />
                    <Route path="/about" component={About} />
                </div>
            </div>
        </Router>
        );
    }
}

export default withRouter(App);
