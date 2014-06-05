// import express webapp framework for request/response middleware
var express = require('express');

// import file path utility for server portability
var pathUtil = require('path');

// import morgan logging middleware so we see requests and responses
var logger = require('morgan');

// initialize the app
var app = express();

// log request/response activity in dev mode
app.use(logger('dev'));

// try to serve requests as static file requests from the public/ directory
app.use(express.static(pathUtil.join(__dirname, 'public')));

// start the app server on port 8080
app.listen(8080);
console.log('App listening on port 8080');
