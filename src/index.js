import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// BrowserRouter wraps App to allow history access. More here: https://stackoverflow.com/a/43106758
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));