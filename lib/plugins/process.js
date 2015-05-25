'use strict';

var through = require('through2');
var extend = require('extend-shallow');
var PluginError = require('plugin-error');
var utils = require('../utils');

module.exports = function(options) {
  var locals = options.locals;
  var app = this;

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (utils.norender(app, file, locals)) {
      this.push(file);
      return cb();
    }

    file.content = file.contents.toString();
    try {
      var stream = this;
      locals = extend({}, file.data, locals);
      app.render(file, locals, function (err, res) {
        if (err) {
          stream.emit('error', new PluginError('render-plugin', err));
          return cb(err);
        }
        file.contents = new Buffer(res);
        stream.push(file);
        return cb();
      });

    } catch (err) {
      this.emit('error', new PluginError('app-process plugin', err));
      return cb();
    }
  });
};
