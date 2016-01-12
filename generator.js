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

  generate.task('defaultConfig', function(cb) {
    // if (generate._defaultConfig === true) return cb();
    // generate._defaultConfig = true;

    generate.engine(['md', 'text'], require('engine-base'));
    generate.data({year: new Date().getFullYear()});
    generate.data(generate._pkg);
    generate.cache.data.varname = utils.namify(generate.cache.data.name);
    cb();
  });

  /**
   * User prompts
   */

  generate.task('prompt', function(cb) {
    var opts = { save: false, force: true };
    var pkg = env.user.pkg;

    if (!pkg || env.user.isEmpty || env.argv.raw.init) {
      pkg = { name: utils.project(process.cwd()) };
      forceQuestions(generate);
    }

    generate.questions.setData(pkg);
    generate.ask(opts, function(err, answers) {
      if (err) return cb(err);
      if (!pkg) answers = {};

      answers.varname = utils.namify(answers.name);
      generate.set('answers', answers);
      cb();
    });
  });

  /**
   * Load templates to be rendered
   */

  generate.task('templates', ['defaultConfig'], function(cb) {
    var opts = { cwd: env.config.cwd, dot: true };

    glob('templates/*', opts, function(err, files) {
      if (err) return cb(err);
      async.each(files, function(name, next) {
        var fp = path.join(opts.cwd, name);

        var contents = fs.readFileSync(fp);
        generate.template(name, {contents: contents, path: fp});

        next();
      }, cb);
    });
  });

  generate.plugin('render', function() {
    return generate.renderFile('text', generate.get('answers'));
  });

  /**
   * Write files to disk
   */

  // generate.task('write', function() {
  //   return generate.toStream('templates')
  //     .on('error', console.log)
  //     .pipe(generate.pipeline())
  //     .on('error', console.log)
  //     .pipe(generate.dest(rename(dest)));
  // });

  generate.task('write', function() {
    var plugins = generate.get('argv.plugins');
    var dest = generate.get('argv.dest') || generate.cwd;

    return generate.toStream('templates')
      // .pipe(handle(generate, 'onStream'))
      .pipe(generate.pipeline(plugins))
      .pipe(generate.dest(rename(dest)))
  });

  /**
   * Generate a new project
   */

  generate.task('project', ['prompt', 'templates', 'write']);

  /**
   * Default task to be run
   */

  generate.task('default', function(cb) {
    generate.build('defaults:help', cb);
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

/**
 * Plugin for handling middleware
 *
 * @param {Object} `app` Instance of "app" (assemble, verb, etc) or a collection
 * @param {String} `stage` the middleware stage to run
 */

function handle(app, stage) {
  return utils.through.obj(function(file, enc, next) {
    if (typeof app.handle !== 'function') {
      return next(null, file);
    }
    if (typeof file.options === 'undefined') {
      return next(null, file);
    }
    if (file.isNull()) return next();
    app.handle(stage, file, next);
  });
}
