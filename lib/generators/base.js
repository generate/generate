'use strict';

module.exports = function(verb) {
  verb.task('default', ['readme']);

  verb.task('readme', function(cb) {
    console.log('readme')
    // verb.generate('readme:default', cb);
    cb()
  });

  // verb.register('readme', function(app) {
  //   app.task('verbmd', function(cb) {
  //     console.log('verbmd')
  //     cb();
  //   });
  //   app.task('default', ['verbmd']);
  // });

  // verb.register('templates', function(app) {
  //   app.task('create', function(cb) {
  //     app.create('badges', {viewType: 'partial'});
  //     app.create('includes', {viewType: 'partial'});
  //     app.create('docs');
  //     cb();
  //   });
  //   app.task('load', function(cb) {
  //     app.docs('docs/*.md', {cwd: app.cwd});
  //     cb();
  //   });
  //   app.task('write', function(cb) {
  //     cb();
  //   });
  //   app.task('default', ['create', 'load']);
  // });
};
