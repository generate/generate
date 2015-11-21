'use strict';

var list = require('base-list');
var create = require('base-runner');
var fns = require('./middleware');
var utils = require('./utils');
var argv = require('./argv');

module.exports = function(Generate, options) {
  var config = utils.extend({
    parent: 'Generate',
    child: 'Generator',
    appname: 'generate',
    method: 'generator',
    plural: 'generators',
    configfile: 'generate.js',
    initFn: function () {
      this.isGenerate = true;
      this.isGenerator = false;
    },
    inspectFn: function (obj) {
      obj.isGenerate = this.isGenerate;
      obj.isGenerator = this.isGenerator;
      obj.generators = this.generators;
    },
  }, options);

  config.tasks = require(__dirname + '/tasks');
  config.fns = require(__dirname + '/middleware');

  /**
   * Add list plugin
   */

  Generate.use(list(config));
  Generate.use(utils.tree);

  /**
   * Expose custom `Runner` constructor
   */

  return create(Generate, config);
};
