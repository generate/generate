#!/usr/bin/env node

var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var app = require('./');

var stack = [];
argv._.forEach(function (name) {
  stack.push(namify(name));
  var match = app.generator(namify(name));
  if (match) {
    var cwd = path.dirname(match);
    app.set('cwd', cwd);
    app.set('templates', cwd + '/templates');
    app.emit('loaded');
    require(match);
  }
});


if (argv.set) {
  var args = argv.set.split('=');
  app.store.set.apply(app.store, args);
}

if (argv.has) {
  var args = argv.has.split('=');
  app.store.has.apply(app.store, args);
}

if (argv.omit) {
  var args = argv.omit.split('=');
  app.store.omit.apply(app.store, args);
}

// placeholder
function namify(name) {
  return 'generate-' + name;
}
