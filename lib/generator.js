'use strict';

module.exports = function(app, base, env, options) {

  /**
   * Register sub-generators (as plugins)
   */

  app.use(require('generate-collections'));
  app.use(require('generate-defaults'));

  /**
   * Ensure generate is working for you.
   *
   * ```sh
   * # should print `pong` in the terminal
   * $ gen ping
   * ```
   * @name ping
   * @api public
   */

  app.task('ping', {silent: true}, function(cb) {
    console.log('pong');
    cb();
  });

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
   * Render a single `--src` file to the given `--dest` or current working directory.
   *
   * ```sh
   * $ gen defaults:render
   * # aliased as
   * $ gen render
   * ```
   * @name render
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

  app.task('default',  options._.length ? options._ : ['help']);
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
