'use strict';

var exists = require('fs-exists-sync');
var fs = require('fs');

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
  if (tasks.length === 1 && tasks[0] === 'default') {

    // if a `generator.js` does not exist, return an empty array
    if (!exists(configFile)) {
      return ['help'];
    }
  }
  return tasks;
}
