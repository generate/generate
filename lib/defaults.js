'use strict';

var utils = require('./utils');

module.exports = function(options) {
  return function(app) {

    this.data({
      year: new Date().getFullYear()
    });

    /**
     * Load an object of middleware functions.
     */

    this.define('loadTemplates', function(patterns, options) {
      var opts = utils.extend({cwd: process.cwd(), dot: true}, options);
      opts.cwd = path.resolve(opts.cwd, 'templates');
      opts.realpath = true;
      return utils.glob.sync(patterns, opts);
    });

    /**
     * Load an object of middleware functions.
     */

    this.define('loadMiddleware', function(fns) {
      for (var fn in fns) {
        fns[fn].call(this, this, this.base, {});
      }
    });

    /**
     * Load an object of tasks.
     */

    this.define('loadTasks', function(tasks) {
      for (var key in tasks) {
        this.task(key, tasks[key].call(this, this, this.base, {}));
      }
    });
  };
};
