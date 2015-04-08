#!/usr/bin/env node

var path = require('path');
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
  generate.set('cwd', cwd);
  generate.set('templates', cwd + '/templates');
  generate.emit('loaded');

  var instance = require(file);
  process.nextTick(function () {
    instance.run.apply(instance, tasks);
  });
}


generate.on('last', function () {
  if (argv.set) {
    var args = argv.set.split('=');
    generate.store.set.apply(generate.store, args);
  }

  if (argv.has) {
    var args = argv.has.split('=');
    generate.store.has.apply(generate.store, args);
  }

  if (argv.omit) {
    var args = argv.omit.split('=');
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
//   console.log('finished', '\'' + chalk.cyan(e.task) + '\'', 'after', chalk.magenta(e.hrDuration));
// });

// generate.on('task_err', function (e) {
//   console.log(chalk.cyan(e.task), chalk.red('errored after'), chalk.magenta(e.hrDuration));
// });

// generate.on('task_not_found', function (err) {
//   console.log(chalk.red('task \'' + err.task + '\' is not in your generate.js'));
//   console.log('please check the documentation for proper generate.js formatting');
//   exit(1);
// });

// function logTasks(env, instance) {
//   var tree = taskTree(instance.tasks);
//   tree.label = 'Tasks for ' + tildify(instance.module);
//   archy(tree).split('\n').forEach(function (v) {
//     if (v.trim().length === 0) {
//       return;
//     }
//     gutil.log(v);
//   });
// }

// placeholder
function namify(name) {
  return 'generate-' + name;
}

if (!argv._.length) {
  generate.emit('loaded');
}
