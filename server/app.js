var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// Uncomment after placing favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.co')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;

/*
When a button is clicked, you use axios to make a get request to the API that is hosted on a separate port (your API for DB queries)
Then you get the data (maybe set in state?) and then prop drill to the proper components
This is how you send data from express to react
Also Node has reserved keywords for the URL you want to hit, so you should use vars/keywords instead of explicit URLs
At the very least, use a variable to represent the base URL string
*/