'use strict';

var choices = require('../plugins/choices');
var utils = require('../utils');

module.exports = function(app, base, env) {
  var questions = utils.questions();
  var msg = 'Which items would you like to update?';

  questions
    .set('author.username', 'What is your github username?')
    .set('author.name', 'What is your name?')
    .set('author.url', 'What URL do you want to use for author.url?')
    .set('setup', choices(msg, questions.queue), {save: false});

  return function(cb) {
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
  };
};
