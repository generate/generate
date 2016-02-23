'use strict';

var questions = require('base-questions');
var merge = require('mixin-deep');
var get = require('get-value');
var answerCache = {};

module.exports = function(app, options) {
  if (!app.ask) app.use(questions());
  var base = app.base || app;

  app.asyncHelper('ask', function ask(name, question, locals, cb) {
    if (typeof question === 'function') {
      return ask.call(this, name, {}, {}, question);
    }
    if (typeof locals === 'function') {
      return ask.call(this, name, question, {}, locals);
    }

    if (this.app.base) {
      base = this.app.base;
    }

    locals = locals || {};
    var def;

    if (typeof locals === 'string') {
      def = locals;
    } else {
      def = locals.default;
    }

    app.base.questions
      .set('author.name', 'Author\'s name?', {force: true})
      .set('author.username', 'Author\'s username?', {force: true})
      .set('author.twitter', 'Author\'s twitter?')
      .set('author.email', 'Author\'s email?')
      .set('author.url', 'Author\'s URL?', {force: true})

      .set('project.name', 'Project name?', {force: true})
      .set('project.owner', 'Project owner?', {force: true})
      .set('project.description', 'Project description?', {force: true})
      .set('project.version', 'Version?', {force: true});

    var answers = merge({}, app.store.data, app.store.local.data);
    if (answerCache[name]) {
      if (app.base.questions.has(name)) {
        app.base.questions.del(name);
      }
      var res = app.base.data(name) || '';
      cb(null, res);
      return;
    }

    answerCache[name] = true;

    app.base.questions.on('ask', function(key, question, answers) {
      var val = app.store.local.get(key);
      if (typeof val === 'undefined') {
        val = get(app.base.cache.data, key);
      }
      if (typeof val !== 'undefined') {
        app.base.data(key, val);
      }
      app.base.questions.off('ask');
    });

    app.base.questions.on('answer', function(key, question, answers) {
      var val = question.getAnswer(app.base.questions.locale);
      if (typeof val !== 'undefined') {
        app.store.local.set(key, val);
        app.base.data(key, val);
      }
      app.base.questions.off('answer');
    });

    app.base.ask(name, function(err, answers) {
      if (err) return cb(err);
      var res = app.base.data(name) || '';
      answerCache = merge({}, answerCache, answers);
      cb(null, res);
    });
  });
};
