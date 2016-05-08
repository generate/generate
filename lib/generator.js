'use strict';

var path = require('path');
var cwd = path.resolve.bind(path, __dirname);
var argv = require('minimist')(process.argv.slice(2));
var through = require('through2');

module.exports = function(app, base) {
  var tasks = argv._.length ? argv._ : ['help'];

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
    app.question('dest', 'Destination directory?', {default: app.cwd});
    if (app.option('dest')) return cb();
    app.ask('dest', {save: false}, function(err, answers) {
      if (err) return cb(err);
      app.option('dest', path.join(app.cwd, answers.dest));
      cb();
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
    file(app, '*.js', cwd('templates'), cb);
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
    if (!argv.src) {
      app.emit('error', new Error('Expected a `--src` filepath'));
    } else {
      file(app, argv.src, app.cwd, cb);
    }
  });

  /**
   * Default task
   */

  app.task('default', tasks);
};

function file(app, name, templates, cb) {
  var dest = app.option('dest') || '';
  var result = [];

  app.src(name, {cwd: templates})
    .pipe(app.renderFile('*'))
    .pipe(through.obj(function(file, enc, next) {
      if (!dest) {
        app.build('dest', function(err) {
          if (err) return next(err);
          dest = app.option('dest');
          next(null, file);
        });
      } else {
        next(null, file);
      }
    }))
    .pipe(app.conflicts(dest))
    .pipe(app.dest(function() {
      return dest;
    }))
    .on('error', cb)
    .on('end', function() {
      console.log(result)
      // console.log('created', filepath);
      cb();
    });
}
