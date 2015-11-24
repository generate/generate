'use strict';

var cli = require('base-cli');
var utils = require('./utils');

module.exports = function (app) {
  app.use(cli());

  app.cli
    .map('data', function(val) {
      app.visit('data', val);
    })
    .map('cwd', function (fp) {
      app.option('cwd', fp);
    })
    .map('generators', function (tasks) {
      app.generate(tasks, function(err) {
        if (err) return console.log(err);
        utils.timestamp('done');
      });
    })

  app.define('commands', app.cli.keys);
};

