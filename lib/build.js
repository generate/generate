'use strict';

var toTasks = require('./to-tasks');
var utils = require('./utils');

exports.toTasks = function(argv, app, base, env) {
  var args = toTasks(argv, app, base, env);
  env.argv = args;
  env.argv.raw = argv;
  app.option(args.options);
  app.cli.process(args.commands);
  return args;
};

exports.runTasks = function(app) {
  var build = app.build;
  delete app.build;

  app.define('build', function(argv, cb) {
    var args = exports.toTasks(argv, app, app.base, app.env);
    app.emit('argv', argv);

    if (app.option('tasks.choose')) {
      return chooseTasks(app, cb);
    }

    args.unknown.forEach(function(arg) {
      app.emit('error', 'cannot resolve argument: ' + arg);
    });

    utils.async.each(args.tasks, function(tasks, next) {
      if (!tasks) return next();
      var arg = tasks.split(':');

      try {
        // a task was specified
        if (arg.length === 1) {
          build.call(app, taskArray(tasks), next);
          return;
        }

        // a generator and one or more tasks were specified
        var generator = lookupGenerator(arg[0], app);
        generator.option(args.options);
        if (!generator.env) generator.env = app.env;
        generator.env.argv = args;
        tasks = taskArray(arg[1]);
        build.call(generator, tasks, next);
      } catch (err) {
        next(err);
      }
    }, cb);
  });
};

function taskArray(tasks) {
  if (typeof tasks === 'string') {
    return tasks.split(',');
  }
  return tasks;
}

function lookupGenerator(name, generate) {
  var app = generate.get(name);
  if (app && !app.isGenerate) {
    app = generate.registerPath(app.alias, app.path);
  }
  return app;
}

function chooseTasks(app, cb) {
  app.disable('choose');
  app.disable('tasks.choose');
  app.chooseTasks(function(err, results) {
    if (err) throw err;
    var obj = utils.tableize(results, true);
    var res = '';
    for (var key in obj) {
      var val = obj[key];
      if (Array.isArray(val)) {
        val = val.join(',');
      }
      res += key + ':' + val;
    }
    app.build(res, cb);
  });
}
