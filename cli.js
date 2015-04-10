#!/usr/bin/env node

var path = require('path');
var chalk = require('chalk');
var prettyTime = require('pretty-hrtime');
var argv = require('minimist')(process.argv.slice(2));
var taskTree = require('./lib/utils/task-tree');
var generate = require('./');

var stack = argv._;
var name = stack.shift();
var tasks = stack.length ? stack : ['default'];

var generator = generate.generator(name);
var file = generator.module;

if (file) {
  var cwd = path.dirname(file);
  generate.set('generator.cwd', cwd);
  generate.set('generator.templates', cwd + '/templates');
  generate.set('args', argv);
  generate.emit('loaded');

  var instance = require(file);
  process.nextTick(function () {
    instance.run.apply(instance, tasks);
  });
}

// exit with 0 or 1
var failed = false;
process.once('exit', function(code) {
  if (code === 0 && failed) {
    exit(1);
  }
});

generate.on('last', function () {
  var args;
  if (argv.set) {
    args = argv.set.split('=');
    generate.store.set.apply(generate.store, args);
  }

  if (argv.has) {
    args = argv.has.split('=');
    generate.store.has.apply(generate.store, args);
  }

  if (argv.omit) {
    args = argv.omit.split('=');
    generate.store.omit.apply(generate.store, args);
  }

  if (argv.del) {
    generate.store.delete({force: true});
  }
});


// generate.on('err', function () {
//   failed = true;
// });

// generate.on('task_start', function (e) {
//   console.log('starting', '\'' + chalk.cyan(e.task) + '\'');
// });

// generate.on('task_stop', function (e) {
//   var time = prettyTime(e.hrDuration);
//   console.log('finished', '\'' + chalk.cyan(e.task) + '\'', 'after', chalk.magenta(time));
// });

// generate.on('task_err', function (e) {
//   var msg = formatError(e);
//   var time = prettyTime(e.hrDuration);
//   console.log(chalk.cyan(e.task), chalk.red('errored after'), chalk.magenta(time));
//   console.log(msg);
// });

// generate.on('task_not_found', function (err) {
//   console.log(chalk.red('task \'' + err.task + '\' is not in your verbfile'));
//   console.log('please check the documentation for proper verbfile formatting');
//   exit(1);
// });

// function logTasks(env, instance) {
//   var tree = taskTree(instance.tasks);
//   tree.label = 'Tasks for ' + tildify(instance.module);
//   archy(tree).split('\n').forEach(function (v) {
//     if (v.trim().length === 0) {
//       return;
//     }
//     console.log(v);
//   });
// }


// format orchestrator errors
function formatError(e) {
  if (!e.err) {
    return e.message;
  }

  // PluginError
  if (typeof e.err.showStack === 'boolean') {
    return e.err.toString();
  }

  // normal error
  if (e.err.stack) {
    return e.err.stack;
  }

  // unknown (string, number, etc.)
  return new Error(String(e.err)).stack;
}


// fix stdout truncation on windows
function exit(code) {
  if (process.platform === 'win32' && process.stdout.bufferSize) {
    process.stdout.once('drain', function() {
      process.exit(code);
    });
    return;
  }
  process.exit(code);
}

if (!argv._.length) {
  generate.emit('loaded');
}
