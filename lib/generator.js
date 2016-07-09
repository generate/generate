'use strict';

var utils = require('./utils');

module.exports = function(app, base, env, options) {
  var common = new utils.Store('common-config');
  var pkg = require('../package');

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

  app.task('v', {silent: true}, function(cb) {
    console.log('version', pkg.version);
    cb();
  });

  /**
   * Generate an `assemblefile.js`
   */

  app.task('new', function(cb) {
    app.src('templates/generator.js', {cwd: __dirname})
      .pipe(app.dest(app.options.dest || app.cwd))
      .on('end', function() {
        console.log(utils.log.timestamp, 'created generator.js');
        cb();
      });
  });

  /**
   * Save personal defaults in user home.
   */

  app.register('store', function(gen) {
    gen.enable('silent');

    gen.task('del', function(cb) {
      var keys = ['name', 'username', 'twitter', 'email'];
      keys.forEach(function(key) {
        console.log(utils.log.red('  Deleted:'), key, common.get(key));
        common.del(keys);
      });
      cb();
    });

    gen.task('show', function(cb) {
      var keys = ['name', 'username', 'twitter', 'email'];
      console.log();
      keys.forEach(function(key) {
        console.log(key + ': ' + utils.log.cyan(common.get(key)));
      });
      console.log();
      cb();
    });

    gen.task('me', function(cb) {
      console.log();
      console.log('  Answers to following questions will be stored in:', utils.log.bold('~/.common-config.json'));
      console.log('  The stored values will be used later in (your) templates.');
      console.log(`  To skip a question, just hit ${utils.log.bold('<enter>')}`);
      console.log();

      app.question('common.name', 'What is your name?');
      app.question('common.username', 'GitHub username?');
      app.question('common.url', 'GitHub URL?');
      app.question('common.twitter', 'Twitter username?');
      app.question('common.email', 'Email address?');

      app.ask('common', {save: false}, function(err, answers) {
        if (err) return cb(err);

        if (!answers.common) {
          cb();
          return;
        }

        var vals = [];
        for (var key in answers.common) {
          if (answers.common.hasOwnProperty(key)) {
            var val = answers.common[key];
            common.set(key, val);
            vals.push(utils.log.green(key + ': ' + val));
          }
        }

        console.log();
        console.log('  Saved:');
        console.log();
        console.log('   ', vals.join('\n    '));
        console.log();
        console.log('  To delete these values, run:');
        console.log();
        console.log(utils.log.bold('    $ gen store:del'));
        console.log();
        cb();
      });
    });

    gen.task('default', ['me']);
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
    app.enable('silent');
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

  app.task('default', ['help']);
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
