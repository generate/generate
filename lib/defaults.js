'use strict';

var utils = require('./utils');

module.exports = function(options) {
  return function(app) {

    /**
     * Load an object of middleware functions.
     */

    this.loadTemplates = function(patterns, options) {
      var opts = utils.extend({cwd: process.cwd(), dot: true}, options);
      opts.cwd = path.resolve(opts.cwd, 'templates');
      opts.realpath = true;
      return utils.glob.sync(patterns, opts);
    };

    /**
     * Load an object of middleware functions.
     */

    this.loadMiddleware = function(fns) {
      for (var fn in fns) this.invoke(fns[fn]);
    };

    /**
     * Load an object of tasks.
     */

    this.loadTasks = function(tasks) {
      for (var key in tasks) {
        this.task(key, this.invoke(tasks[key]));
      }
    };
  };
};
