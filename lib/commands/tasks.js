'use strict';

var exists = require('fs-exists-sync');

/**
 * Run the given generators and tasks. This flag is unnecessary when
 * used with [base-runner][].
 *
 * ```sh
 * # run task 'foo'
 * $ app --tasks foo
 * # => {task: ['foo']}
 * # run generator 'foo', task 'bar'
 * $ app --tasks foo:bar
 * # => {task: ['foo:bar']}
 * ```
 * @name tasks
 * @api public
 * @cli public
 */

module.exports = function(app, options) {
  return function(val, key, config, next) {
    var tasks = setTasks(app, options.env.configFile, val);
    app.generate(tasks, next);
  };
};

/**
 * Determine the task to run
 */

function setTasks(app, configFile, tasks) {
  if (tasks.length === 1) {
    var task = tasks[0];
    switch(task) {
      case 'default':
        if (!exists(configFile)) {
          // if a `generator.js` does not exist in user's cwd, run the "help" task
          return ['defaults:help'];
        }
        break;
      case 'new':
        return ['defaults:new'];
      case 'render':
        return ['defaults:render'];
      default:
        // customize help menu
        app.option('appname', 'generator');
        // silence task progress
        app.enable('silent');
        return ['defaults:help'];
    }
  }
  return tasks;
}
