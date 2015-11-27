'use strict';

module.exports = function(app) {
  var cli = require('base-cli');
  app.use(cli());

  app.cli
    .map('data', function(val) {
      app.visit('data', val);
    })
    .map('cwd', function(fp) {
      app.option('cwd', fp);
    });

  app.define('commands', app.cli.keys);
};

