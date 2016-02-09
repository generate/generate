'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function(app) {
  app.task('default', function(cb) {
    app.questions.set('generator', 'Want to choose a generator to run?', {
      save: false
    });

    app.questions.set('generator', 'Want to still run tasks when arbitrary command line flags are passed (e.g. `--foo`)?', {
      save: false
    });

    app.ask('generator', function(err, answers) {
      if (err) return cb(err);

      if (utils.is(answers.generator)) {
        var files = utils.glob.sync('generate-*', { cwd: utils.gm });

        app.choices('list', files, function(err, choices) {
          if (err) return cb(err);
          choices.list.forEach(function(name) {
            app.generator(name, path.resolve(utils.gm, name));
          });
          app.generateEach(choices.list, cb);
        });

      } else {
        cb();
      }
    });
  });
};
