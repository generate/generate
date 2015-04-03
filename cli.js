#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var app = require('./');

var stack = [];
argv._.forEach(function (name) {
  stack.push(namify(name));
  console.log(app.generator(namify(name)));
});

console.log(stack);

// placeholder
function namify(name) {
  return 'generate-' + name;
}
