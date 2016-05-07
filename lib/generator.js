'use strict';

var argv = require('minimist')(process.argv.slice(2));

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
   * $ gen generate:help
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
   * $ gen generate:dest
   * ```
   * @name dest
   * @api public
   */

  app.task('dest', function(cb) {
    app.question('dest', 'Destination directory?', {default: process.cwd()});
    if (app.option('dest')) return cb();
    app.ask('dest', {save: false}, function(err, answers) {
      if (err) return cb(err);
      app.option('dest', answers.dest);
      cb();
    });
  });

  /**
   * Add a generator.js file to `argv.dest` or user cwd.
   *
   * ```sh
   * $ gen generate:new
   * ```
   * @name new
   * @api public
   */

  app.task('new', ['dest'], function(cb) {
    app.src('*.js', {cwd: __dirname + '/templates'})
      .pipe(app.renderFile('*'))
      .pipe(app.dest(app.option('dest')))
      .on('error', cb)
      .on('end', function() {
        console.log('generator.js', 'written to', app.option('dest'));
        cb();
      });
  });

  /**
   * Render a `--src` file to `--dest` directory. The user's working directory is used
   * if a `--dest` is not defined.
   *
   * ```sh
   * $ gen new
   * ```
   * @name new
   * @api public
   */

  app.task('render', ['dest'], function(cb) {
    if (!argv.src) {
      console.log('please specify a --src file');
      process.exit(1);
    }

    // app.question('first.name', 'What is your first name?');

    app.src(argv.src, {cwd: app.cwd})
      .pipe(app.renderFile('*'))
      .pipe(app.conflicts(app.option('dest')))
      .pipe(app.dest(app.option('dest')))
      .on('error', cb)
      .on('end', function() {
        console.log(argv.src, 'written to', app.option('dest'));
        cb();
      });
  });

  /**
   * Default task
   */

  app.task('default', tasks);
};
