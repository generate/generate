#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var generators = require('../lib/generators');
var utils = require('../lib/utils');

generators(argv)
  .register('generate-*', {cwd: utils.gm})
  .base.task('run', function (cb) {
    generate.run(cb);
  })
  .base.build('default', function (err) {
    if (err) console.error(err);
  });
