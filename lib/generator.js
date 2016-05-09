'use strict';

var path = require('path');
var cwd = path.resolve.bind(path, __dirname);
var argv = require('minimist')(process.argv.slice(2));
var exists = require('fs-exists-sync');
var through = require('through2');

module.exports = function(app, base) {
  var tasks = argv._.length ? argv._ : ['help'];
  app.option(argv);

  /**
   * Register sub-generators (as plugins)
   */

  app.use(require('generate-collections'));
  app.use(require('generate-defaults'));

  /**
   * Display `--help`.
   *
   * ```sh
   * $ gen defaults:help
   * ```
   * @name help
   * @api public
   */

  app.task('help', { silent: true }, function(cb) {
    app.cli.process({ help: true }, cb);
  });

  /**
   * Prompt the user for the `dest` directory to use for generated files.
   * This is called by the [new]() task.
   *
   * ```sh
   * $ gen defaults:dest
   * ```
   * @name dest
   * @api public
   */

  app.task('dest', function(cb) {
    app.question('dest', 'Destination directory?');
    if (app.option('dest')) return cb();
    app.ask('dest', {save: false}, function(err, answers) {
      if (err) return cb(err);
      app.option('dest', path.resolve(answers.dest));
      cb();
    });
  });

  /**
   * Add a generator.js file to `argv.dest` or user cwd.
   *
   * ```sh
   * $ gen defaults.new
   * ```
   * @name new
   * @api public
   */

  app.register('new', function(sub) {
    sub.task('default', function(cb) {
      file(app, 'generator.js', cwd('templates'), cb);
    });
  });

  /**
   * Add a generator.js file to `argv.dest` or user cwd.
   *
   * ```sh
   * $ gen defaults:new
   * ```
   * @name new
   * @api public
   */

  app.task('new', function(cb) {
    app.generate('new', cb);
  });

  /**
   * Render a `--src` file to `--dest` directory. The user's working directory is used
   * if a `--dest` is not defined.
   *
   * ```sh
   * $ gen defaults:new
   * ```
   * @name new
   * @api public
   */

  app.task('render', function(cb) {
    if (!app.option('src')) {
      app.emit('error', new Error('Expected a `--src` filepath'));
    } else if (!app.option('dest')) {
      app.build(['dest', 'render'], cb);
    } else {
      file(app, app.option('src'), app.cwd, cb);
    }
  });

  /**
   * Default task
   */

  app.task('default', tasks);
};

function file(app, name, templates, dest, cb) {
  if (typeof dest === 'function') {
    cb = dest;
    dest = null;
  }

  dest = dest || app.option('dest') || '';
  app.src(name, {cwd: templates})
    .pipe(app.renderFile('*'))
    .pipe(app.conflicts(dest))
    .pipe(app.dest(dest))
    .on('error', cb)
    .on('end', cb);
}
