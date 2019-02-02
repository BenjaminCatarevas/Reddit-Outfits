import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import SearchUser from './components/SearchUser'
import UserOutfits from './components/UserComments';
import NavigationBar from './components/NavigationBar';
import About from './components/About';
import Threads from './components/Thread';

class App extends Component {

  searchUser(user) {
    axios.get(`http://localhost:3001/u/${user}`)
      .then(res => console.log(res.data))
      .catch('pri nt')
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <NavigationBar/>
            <SearchUser searchUser={this.searchUser} />
            <Route exact path="/" />
            <Route path="/u/:username" render = {(props) => <div><UserOutfits {...props}/> </div>} /> 
            <Route path="/about" component={About} />
            <Route path="/threads" component={Threads} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
