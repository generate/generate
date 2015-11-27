'use strict';

var fs = require('fs');
var path = require('path');
var choices = require('./plugins/choices');
var utils = require('./utils');

module.exports = function(app, base) {
  var plugins = base.get('argv.plugins');
  var glob = base.get('argv.files');
  if (glob) {
    glob = glob.split(',');
  } else {
    glob = ['*', 'lib/*', 'bin/*'];
  }

  base.create('files', {
    renameKey: function(key) {
      return path.basename(key);
    }
  });

  app.task('me', function(cb) {
    me(app, base, cb);
  });

  app.task('files', function(cb) {
    utils.globFiles(glob).forEach(function(fp) {
      if (fs.statSync(fp).isFile()) {
        base.file(fp, {content: fs.readFileSync(fp)});
      }
    });
    base.emit('loaded', base.files);
    cb();
  });

  app.task('dest', function(cb) {
    app.toStream('files')
      .on('error', cb)
      // handle `onStream` middleware
      .pipe(handle(app, 'onStream'))
      // run any plugins defined by the user
      .pipe(app.pipeline(plugins))
      // handle `preWrite` middleware
      .pipe(handle(app, 'preWrite'))
      // write files to the file system
      .pipe(app.dest('.'))
      .pipe(utils.exhaust(handle(app, 'postWrite')))
      .on('error', cb)
      .on('end', cb);
  });

  app.task('list', function(cb) {
    base.list(function(err, args) {
      if (err) return cb(err);
      base.build(args.generators, cb);
    });
  });

  app.task('tree', function(cb) {
    console.log(utils.tree(base.generators));
    cb();
  });

  app.task('noop', function(cb) {
    cb();
  });
};

function me(app, base, cb) {
  var questions = utils.questions();
  var msg = 'Which items would you like to update?';

  questions
    .set('author.name', 'May I ask your name?')
    .set('author.url', 'What URL do you want to use for author.url?')
    .set('author.username', 'What is your GitHub username?')
    .set('setup', choices(msg, questions.queue), {save: false});

  questions.ask('setup', function(err, answers) {
    if (err) return cb(err);

    var keys = utils.flatten(answers.setup || []);
    if (!keys.length) {
      return cb();
    }

    keys.forEach(function(key) {
      questions.get(key).options.force = true;
    });

    questions.ask(keys, function(err, answers) {
      if (err) return cb(err);
      base.store.set(answers);
      cb();
    });
  });
}

function handle(app, stage) {
  return utils.through.obj(function(file, enc, next) {
    if (file.isNull()) return next();
    app.handle(stage, file, next);
  });
}
