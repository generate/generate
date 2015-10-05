'use strict';

var typeOf = require('kind-of');
var combine = require('stream-combiner');
var through = require('through2');
var contents = require('file-contents');
var stats = require('file-stat');

module.exports = function (app) {
  app.plugins = app.plugins || [];

  /**
   * Register a plugin by `name`
   *
   * @param  {String} `name`
   * @param  {Function} `fn`
   * @api public
   */

  app.plugin = function(name, fn) {
    if (arguments.length === 1) {
      return this.plugins[name];
    }
    this.plugins[name] = fn;
    return this;
  };

  /**
   * Create a plugin pipeline from an array of plugins.
   *
   * @param  {Array} `plugins` Each plugin is a function that returns a stream, or the name of a registered plugin.
   * @param  {Object} `options`
   * @return {Stream}
   * @api public
   */

  app.pipeline = function(plugins, options) {
    var opts = this.defaults(options);
    plugins = plugins || [];

    var pipeline = [];
    pipeline.push(stats(opts));
    pipeline.push(contents(opts));

    var len = plugins.length, i = -1;

    while(++i < len) {
      var val = plugins[i];
      if (typeOf(val) === 'function') {
        pipeline.push(val.call(this, opts));

      } else if (typeOf(val) === 'object') {
        pipeline.push(val);

      } else if (typeof val === 'string' && this.plugins.hasOwnProperty(val) && !opts['plugin ' + val] === false) {
        pipeline.push(this.plugins[val].call(this, opts));

      } else {
        pipeline.push(through.obj());
      }
    }
    return combine(pipeline);
  };
};
