'use strict';

process.on('exit', function() {
  require('set-blocking')(true);
});

var path = require('path');
var isValid = require('is-valid-app');
var middleware = require('./middleware');
var helpers = require('./helpers');

module.exports = function(options) {
  return function(app) {
    if (!isValid(app, 'generate-support-common')) return;
    app.use(require('generate-collections'));
    app.use(require('generate-defaults'));
    app.use(require('verb-toc'));
    app.use(middleware());
    app.use(helpers());
    app.option('engine', '*');

    if (!app.docs) app.create('docs');
    app.option('renameKey', function(key, file) {
      return file ? file.basename : path.basename(key);
    });
  };
};
