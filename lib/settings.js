'use strict';

var settings = require('./settings/');
var schema = require('./schema');
var utils = require('./utils');

/**
 * Create
 */

module.exports = function(options) {
  return function() {
    this.use(schema(options));

    this.define('settings', function(options) {
      return new utils.Settings(this.schema(options))
    });

    this.define('loadSettings', function(argv) {
      var config = this.settings()
        .set('file', settings.configfile(this, 'generator'))
        .set('opts', settings.opts(this))
        .set('pkg', settings.pkg(this, 'generate'))
        .set('argv', argv);

      return config;
      // var opts = config.merge();
      // this.option(opts);
      // return opts;
    });
  };
};
