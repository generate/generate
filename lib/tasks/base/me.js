'use strict';

var choices = require('../../plugins/choices');
var utils = require('../../utils');

module.exports = function(app, base, env) {
  // var questions = utils.questions();
  // var inquirer = questions.inquirer;
  // var fields = ['author.username', 'author.name', 'author.url'];
  // var msg = 'Which items would you like to update?';

  // questions
  //   .set('setup', choices(msg, fields, inquirer))
  //   .set('author.username', 'What is your github username?')
  //   .set('author.name', 'What is your name?')
  //   .set('author.url', 'What URL do you want to use for author.url?')

  return function (cb) {
    // questions.ask('setup', function(err, answers) {
    //   if (err) return cb(err);

    //   var keys = utils.flatten(answers.me);
    //   if (!keys.length) {
    //     return cb();
    //   }

    //   questions.ask(keys, function(err, answers) {
    //     if (err) return cb(err);
    //     env.store.set(answers);
    //     cb()
    //   });
    // });
  };
};



