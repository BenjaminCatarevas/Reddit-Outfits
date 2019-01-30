import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {

  test() {
    axios.get('http://localhost:3001/u/test')
      .then(res => console.log(res.data))
      .catch('pri nt')
  }

  render() {
    return (
      <div className="App">
        <h1>Hi express</h1>
        {this.test()}
      </div>
    );
  }
}

export default App;
