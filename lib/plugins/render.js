'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var extend = require('lodash')._.extend;
var utils = require('../utils');

module.exports = function render_(locals) {
  var generate = this, id = this.gettask();

  locals = locals || {};
  locals.options = locals.options || {};

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new utils.PluginError('generate-render plugin', 'Streaming is not supported.'));
      return cb();
    }

    if (norender(generate, file.ext, file, locals)) {
      this.push(file);
      return cb();
    }

    var collection = generate.inflections[id];
    var template = generate.views[collection][file.id];
    template.content = file.contents.toString();

    extend(locals.options, generate.options);
    locals = extend({}, locals, file.locals);
    if (!locals.hasOwnProperty('ext')) {
      locals.ext = file.ext;
    }

    try {
      var stream = this;
      generate.render(template, locals, function(err, content) {
        if (err) {
          console.error(err);
          stream.emit('error', new utils.PluginError('generate render', err));
          cb(err);
          return;
        }

        file.contents = new Buffer(content);
        stream.push(file);
        cb();
      });

    } catch (err) {
      console.error(err);
      this.emit('error', new utils.PluginError('generate render', err));
      return cb();
    }
  });
};

/**
 * Push the `file` through if the user has specfied
 * not to render it.
 */

function norender(generate, ext, file, locals) {
  return !generate.engines.hasOwnProperty(ext)
    || generate.enabled('norender')
    || file.norender === true
    || file.render === false
    || locals.norender === true
    || locals.render === false;
}
