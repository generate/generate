#!/usr/bin/env node

process.env.GENERATE_CLI = true;
var argv = require('minimist')(process.argv.slice(2));
var runner = require('base-runner');
var Generate = require('..');
var config = {
  name: 'generate',
  runner: require('../package'),
  setTasks: setTasks,
  processTitle: 'generate',
  moduleName: 'generate',
  configName: 'generator',
  extensions: {
    '.js': null
  }
};

runner(Generate, config, argv, function(base, options) {
  base.option('lookup', function(key) {
    return [key, `generate-${key}`];
  });

  var opts = base.pkg.get(options.env.name);
  var argv = options.argv;

  if (opts && !argv.noconfig) {
    base.set('cache.config', opts);
    base.option(opts);
  }

  base.option(argv);

  base.generate(options.tasks, function(err) {
    if (err) {
      base.emit('error', err);
    } else {
      base.emit('done');
      process.exit();
    }
  });
});

function setTasks(app, configfile, tasks) {
  return tasks.length === 0 ? ['default'] : tasks;
}

