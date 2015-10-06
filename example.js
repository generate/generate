'use strict';

var scaffold = require('scaffold');
var Generate = require('./');
var app = new Generate();


var config = scaffold({
  expand: true,
  src: ['lib/*.js'],
  dest: 'foo'
});

app.process(config.files, config, function (err) {
  if (err) return console.error('failed');
  console.log('done');
});

