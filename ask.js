'use strict';

var questions = require('base-questions');
var merge = require('mixin-deep');
var get = require('get-value');
var answerCache = {};

module.exports = function(app, base) {
  return function ask(name, question, locals, cb) {
    if (typeof question === 'function') {
      return ask.call(this, name, {}, {}, question);
    }
    if (typeof locals === 'function') {
      return ask.call(this, name, question, {}, locals);
    }

    // this is temporary and not 100% correct, it's being
    // used as a quick way to flesh out some bug in
    // question-store
    base.ask(name, function(err, answers) {
      if (err) return cb(err);
      console.log('helper answers:', answers);
      answerCache = merge({}, answerCache, answers);
      var val = get(answers, name);

      console.log('helper answers name/val:', name, val);
      cb(null, val);
    });
  };
};
