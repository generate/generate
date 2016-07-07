'use strict';

var path = require('path');
var helpers = require('./helpers');
var isValid = require('is-valid-app');
var pkg = require('base-pkg');

module.exports = function(options) {
  return function(app) {
    if (!isValid(app, 'generate-support-common')) return;
    app.use(require('generate-collections'));
    app.use(require('generate-defaults'));
    app.use(require('verb-toc'));
    app.use(helpers());
    app.use(pkg());

    if (!app.docs) app.create('docs');
    app.option('renameKey', function(key, file) {
      return file ? file.basename : path.basename(key);
    });
  };
};
