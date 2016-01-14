'use strict';

var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var utils = require('./lib/utils');

/**
 * This is an example generator, but it can also be used
 * to extend other generators.
 */

module.exports = function(generate, base, env) {
  var dest = argv.dest || process.cwd();
  var async = utils.async;
  var glob = utils.glob;

  /**
   * TODO: User help and defaults
   */

  generate.register('defaults', function(app) {
    app.task('init', function(cb) {
      generate.build(['prompt', 'templates'], cb);
    });

    app.task('help', function(cb) {
      console.log('Would you like to choose a generator to run?');
      console.log('(implement me!)')
      cb();
    });

    app.task('error', function(cb) {
      console.log('generate > error (implement me!)');
      cb();
    });
  });

  /**
   * Readme task
   */

  generate.task('readme', function(cb) {
    console.log('generate > readme');
    cb();
  });

  /**
   * Data store tasks
   */

  generate.register('store', function(app) {
    app.task('del', function(cb) {
      generate.store.del({ force: true });
      console.log('deleted data store');
      cb();
    });
  });

  /**
   * Default configuration settings
   */

  generate.task('setup', function(cb) {
    if (generate._setup === true) return cb();
    generate._setup = true;

    generate.engine(['md', 'text'], require('engine-base'));
    generate.data({year: new Date().getFullYear()});

    if (!env.user.isEmpty) {
      generate.data(generate._pkg);
      var name = generate.get('data.name');
      if (name) {
        generate.data({varname: utils.namify(name)});
      }
    }
    cb();
  });

  /**
   * User prompts
   */

  generate.task('prompt', function(cb) {
    var opts = { save: false, force: true };
    var pkg = env.user.pkg;
    var util = require('util');

    if (!pkg || env.user.isEmpty || env.argv.raw.init) {
      pkg = { name: utils.project(process.cwd()) };
      forceQuestions(generate);
    }

    generate.questions.setData(pkg);
    generate.questions.on('ask', function(name, question) {
      question.answer.erase();
    });

    generate.ask(opts, function(err, answers) {
      if (err) return cb(err);
      if (!pkg) answers = {};
      if (answers.name) {
        answers.varname = utils.namify(answers.name);
      }
      generate.set('answers', answers);
      cb();
    });
  });

  generate.plugin('render', function() {
    return generate.renderFile('text', generate.get('answers'));
  });

  /**
   * Load templates to be rendered
   */

  generate.task('load', function(cb) {
    var opts = { cwd: env.config.cwd, dot: true };
    generate.templates('templates/**/*', opts);
    generate.emit('loaded');
    cb();
  });

  generate.on('build', function() {
    // console.log(arguments);
  });

  /**
   * Render templates and write the result to the file system
   */

  generate.task('templates', ['load'], function() {
    var plugins = generate.get('argv.plugins');
    var dest = generate.get('argv.dest') || generate.cwd;

    return generate.toStream('templates')
      .on('error', generate.log)
      .pipe(generate.pipeline(plugins))
      .on('error', generate.log)
      .pipe(generate.dest(rename(dest)))
  });

  generate.task('project', ['setup', 'prompt', 'templates']);

  /**
   * Default task to be run if no other tasks are specified
   */

  generate.task('default', function(cb) {
    console.log('nothing.');
    cb();
    // generate.build('defaults:help', cb);
  });
};

function forceQuestions(generate) {
  generate.questions.options.forceAll = true;
}

/**
 * Rename template files
 */

function rename(dest) {
  return function(file) {
    file.base = file.dest || dest || '';
    file.path = path.join(file.base, file.basename);
    file.basename = file.basename.replace(/^_/, '.');
    file.basename = file.basename.replace(/^\$/, '');
    return file.base;
  };
}
