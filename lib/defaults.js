'use strict';

module.exports = function(options) {
  return function(app) {

    this.data({
      year: new Date().getFullYear()
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
