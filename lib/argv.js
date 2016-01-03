'use strict';

/**
 * Non-option (`_`) arguments are sifted into the following
 * groups (the resulting `_` array will be empty):
 *
 *   + `_`: this array will be empty after sifting is finished
 *   + `tasks`: argument matches a known task on `app`, `base` or a given generator.
 *   + `options`: argument matches a known option
 *   + `commands`: argument maps to a CLI command (from base-cli)
 *   + `unknown`: argument is unknown
 *
 * Option arguments are also sifted following similar logic, with
 * one exception: `unknown` option arguments are moved onto
 * `args.options`.
 *
 * @param {Object} `argv` Command line arguments, pre-parsed by minimist
 * @param {Object} `app` The user's instance
 * @param {Object} `base` The base instance
 * @return {Object}
 */

module.exports = function(argv, app, base, env) {
  base = base || app.generators.base;

  if (Array.isArray(argv)) {
    argv = { _: argv };
  }

  if (typeof argv === 'string') {
    argv = { _: [argv] };
  }

  var args = {};
  args._ = argv._;
  args.unknown = [];
  args.commands = {};
  args.options = {};
  args.tasks = [];

  for (var key in argv) {
    if (key === '_') {
      continue;
    }
    if (isCommand(key, app)) {
      args.commands[key] = argv[key];
    } else {
      args.options[key] = argv[key];
    }
  }

  siftTasks(args, app, base, env);
  var len = args._.length;
  var i = -1;

  while (++i < len) {
    var name = args._[i];

    if (isCommand(name, app) || isOption(name, app)) {
      args.options[name] = true;
    } else {
      args.unknown.push(name);
    }
  }

  args._ = [];
  return args;
};

function siftTasks(argv, app, base, env) {
  var len = argv._.length;

  // if no tasks are defined, assign the default
  if (len === 0) {
    argv._ = ['default'];
    len = 1;
  }

  var i = -1;
  var arr = [];

  while (++i < len) {
    var arg = argv._[i];
    var task = toTask(arg, app, base, env);
    if (task) {
      argv.tasks = argv.tasks.concat(task);
    } else {
      arr.push(arg);
    }
  }
  argv._ = arr;
  return argv;
}

function toTask(task, app, base, env) {
  if (!task) return null;

  base = base || app.base;
  var segs = task.split(':');
  var generator = '';

  if (segs.length > 1) {
    generator = segs[0];
    task = segs[1];
  }

  var tasks = task.split(',');
  var prefix;

  if (tasks.length > 1) {
    tasks.forEach(function(t) {
      if (generator) {
        t = generator + ':' + t;
      }

      var resolved = toTask(t, app, base);
      if (resolved === null) {
        var msg = 'task "' + t + '" is not registered';
        if (generator) {
          msg += ' on generator "' + generator + '"';
        }
        throw new Error(msg);
      }

      var parts = resolved.split(':');
      if (parts.length > 1) {
        prefix = parts[0];
      }
    });

    // try to consolidate tasks so they run in one session:
    // converts: `a,b,c` => `generator.base:a,b,c`
    prefix = prefix || generator;
    return prefix ? (prefix + ':' + task) : task;
  }

  if (generator) {
    generator = toGeneratorKey(generator);
  }

  if (generator) {
    var hasGen = app.has(generator);
    if (hasGen) {
      return generator + ':' + task;
    }
  }

  // try "app.tasks"
  if (app.has('tasks', task)) {
    return task;
  }

  // try to get the task from the generator in the cwd
  var alias = app.get('env.config.alias');
  var key = ['generators', alias];

  var currentApp = app.get(key);
  if (alias && currentApp) {
    if (currentApp.has('tasks', task)) {
      return key.join('.') + ':' + task;
    }
  }

  // try "app.generators.base.tasks"
  if (base.tasks[task]) {
    return 'generators.base:' + task;
  }

  // try to find the task on nested generators
  var key = toGeneratorKey(task);
  if (app.has(key)) {
    return key + ':default';
  }

  if (app.tasks[task]) {
    return task;
  }

  // try to lookup the generator first, then
  // resolve the task on the generator istance
  var gen = app.get(generator);
  if (gen && gen.get(['tasks', task])) {
    return task;
  }

  key = toGeneratorKey(task);
  if (app.has('env', key)) {
    return 'env.' + key + ':default';
  }

  key = toGeneratorKey(generator);
  if (app.has(['env', key])) {
    var foo = 'env.' + key + ':' + task;
    return foo;
  }
  return null;
}

function toGeneratorKey(key) {
  key = key.split(/\.?generators\.?/).join('.');
  if (key.charAt(0) === '.') {
    key = key.slice(1);
  }

  return 'generators.' + key
    .split('.')
    .join('.generators.');
}

function isOption(key, app) {
  if (app.settings && app.settings.config) {
    return app.settings.config.hasOwnProperty(key);
  }
  return app.option(key);
}

function isCommand(key, app) {
  if (app.cli && app.cli.keys) {
    return app.cli.keys.indexOf(key) !== -1;
  }
}
