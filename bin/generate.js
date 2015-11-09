#!/usr/bin/env node

var path = require('path');
var stamp = require('time-stamp');
var gray = require('ansi-gray');
var multi = require('../lib/multi')();
var utils = require('../lib/utils');
var argv = require('minimist')(process.argv.slice(2), {
  alias: {verbose: 'v'}
});

var cmd = utils.commands(argv);
var cli = multi(argv);

var task = cmd.list ? ['list', 'default'] : 'default';

cli.on('*', function (method, key, val) {
  console.log(method + ':', key, val);
});

if (argv.verbose) {
  cli.on('register', function(key) {
    utils.ok(utils.gray('registered'), 'generator', utils.cyan(key));
  });
}

cli.registerEach('generate-*', {cwd: utils.gm});

cli.base.task('run', function (cb) {
  cli.run(cb);
});

cli.base.build(task, function (err) {
  if (err) console.error(err);
  timestamp('done');
});

function timestamp(msg) {
  var time = ' ' + gray(stamp('HH:mm:ss.ms', new Date()));
  return console.log(time, msg, utils.green(utils.successSymbol));
}
