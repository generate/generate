'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function(app) {
  app.task('init', function(cb) {
    app.questions.set('generator', 'Want to choose a generator to run?', {
      save: false
    });

    app.questions.set('flags', 'Want to run tasks when arbitrary command line flags are passed?', {
      save: false
    });

    app.questions.disable('save');

    app.ask('generator', function(err, answers) {
      if (err) return cb(err);

      if (utils.is(answers.generator)) {
        var tasks = [];
        var files = utils.glob.sync('generate-*/generator.js', {
          realpath: true,
          cwd: utils.gm
        });


        app.choices('list', files, function(err, choices) {
          if (err) return cb(err);

          var fp = choices.list[0];
          var name = path.basename(path.dirname(fp));
          app.register(name, fp);
          console.log(fp);
          console.log(name);
          var gen = app.generator(name);
          console.log(gen);
          console.log(choices)

          choices.list.forEach(function(fp) {
            // tasks.push(gen.env.alias);
          });
          // console.log(tasks)
          // app.generateEach(tasks, cb);
          cb();
        });

      } else {
        cb();
      }
    });
  });

  app.task('default', ['init']);
};
