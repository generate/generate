'use strict';

var through = require('through2');
var extend = require('lodash')._.extend;
var utils = require('../utils');

module.exports = function (locals, options) {
  var generate = this;
  return function (file, enc, cb) {
    var collection = generate.inflections[locals.id];
    var template = generate.views[collection][file.id];
    template.content = file.contents.toString();
    var context = extend({}, locals, file.locals);

    try {
      var stream = this;
      generate.render(template, context, function (err, content) {
        if (err) {
          stream.emit('error', new utils.PluginError('process plugin', err));
          return cb(err);
        }
        file.contents = new Buffer(content);
        stream.push(file);
        cb();
      });
    } catch (err) {
      this.emit('error', new utils.PluginError('process plugin', err));
      return cb();
    }
  }
}
