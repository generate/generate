#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var app = require('./');

var stack = [];
argv._.forEach(function (name) {
  stack.push(namify(name));
  console.log(app.generator(namify(name)));
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
