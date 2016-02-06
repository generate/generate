'use strict';

var debug = require('debug')('generate:generator');

module.exports = function(app) {
  app.task('default', function(cb) {
    debug('task "%s"', this.name);
    cb();
  });

  app.task('foo', function(cb) {
    debug('task "%s"', this.name);
    cb();
  });

  app.register('foo', function(foo) {
    foo.task('default', function(cb) {
      debug('task "%s"', this.name);
      cb();
    });

    foo.register('bar', function(bar) {
      bar.task('default', function(cb) {
        debug('task "%s"', this.name);
        cb();
      });
    });
  });

  app.generator('templates', function(templates) {
    debug('generator "%s"', this.namespace);

    templates.task('create', function(cb) {
      debug('task "%s"', this.name);

      templates.create('partials', {viewType: 'partial'});
      templates.create('pages');
      cb();
    });

    templates.task('load', function(cb) {
      debug('task "%s"', this.name);

      console.log(templates.partial)

      cb();
    });

    templates.task('write', function(cb) {
      debug('task "%s"', this.name);

      cb();
    });

    templates.task('default', ['load']);
  });
};
