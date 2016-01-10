'use strict';

var toTasks = require('./to-tasks');
var utils = require('./utils');

module.exports = function(options) {
  return function(app) {
    var build = app.build;
    delete app.build;

    app.define('build', function(argv, cb) {
      var args = parseTasks(argv, this, this.base, this.env);
      this.emit('argv', argv);
      app.cli.process(args.commands);

      if (this.option('tasks.choose')) {
        return chooseTasks(this, cb);
      }

      if (this.option('tasks.display')) {
        displayTasks(this);
        return cb();
      }

      if (args.unknown.length) {
        return cb(handleError(args.unknown, this));
      }

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
          if (!generator) {
            return next(handleError(arg[0]), app);
          }

          generator.option(args.options);
          if (!generator.env) {
            generator.env = app.env;
          }

          generator.env.argv = args;
          tasks = taskArray(arg[1]);

          build.call(generator, tasks, next);
        } catch (err) {
          next(err);
        }
      }, cb);
    });

    function parseTasks(argv, app, base, env) {
      var args = toTasks(argv, app, base, env);
      env.argv = args;
      env.argv.raw = argv;
      app.option(args.options);
      app.cli.process(args.commands);
      return args;
    }
  };
};

function handleError(name, app) {
  var arr = utils.arrayify(name);
  var names = arr.map(function(str) {
     return '"' + str.split('.').pop() + '"';
  });
  var res = names.join(', ');
  var msg = 'cannot find task or generator: "' + res + '"';
  return utils.colors.red(utils.errorSymbol) + ' ' + new Error(msg);
}

function taskArray(tasks) {
  if (typeof tasks === 'string') {
    return tasks.split(',');
  }
  return tasks;
}

function lookupGenerator(name, generate) {
  var app = generate.get(name);
  if (app && !app.isGenerate && !app.isAssemble) {
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

function displayTasks(app) {
  app.disable('tasks.display');
  app.displayTasks();
}
