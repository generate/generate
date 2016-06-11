'use strict';

var path = require('path');
var exists = require('fs-exists-sync');
var argv = require('yargs-parser')(process.argv.slice(2));
var gm = require('global-modules');

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
    if (argv._.length === 1 && argv._[0] === 'help') argv._ = ['default'];
    app.generate(setTasks(app, options.env.configFile, argv._), next);
  };
};

/**
 * Determine the task to run
 */

function setTasks(app, configFile, tasks) {
  tasks = tasks || [];

  if (tasks.length === 0) {
    if (exists(configFile)) {
      return ['default:default'];
    }
    return ['defaults:help'];
  }

  tasks = tasks.map(function(task) {
    if (task.indexOf('help') === 0) {
      return 'defaults:';
    }
    return task;
  });

  if (tasks.length === 1) {
    var task = tasks[0];

    switch (task) {
      case 'default':
        // if a `generator.js` does not exist in user's cwd, run the "help" task
        if (!exists(configFile)) {
          return ['defaults:help'];
        }
        return ['default:default'];
      case 'new':
        return ['defaults:new'];
      case 'render':
        return ['defaults:render'];
      default:
        return tasks;
    }
  }
  return tasks;
}
