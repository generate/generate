'use strict';

var Generate = require('./');
var generate = new Generate();

generate.on('error', function(err) {
  console.log(err);
});

generate.generator('foo', function(app, base, env) {

});

console.log(generate)
