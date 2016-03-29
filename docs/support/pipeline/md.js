'use strict';

var Remarkable = require('remarkable');
var through = require('through2');
var util = require('gulp-util');

module.exports = function(options) {
  var md = new Remarkable(options);
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new util.PluginError('assemble-remarkable', 'Streaming is not supported.'));
      return cb();
    }

    var html = md.render(file.contents.toString());
    file.path = file.path.substr(0, file.path.lastIndexOf('.')) + '.html';
    file.contents = new Buffer(html);
    this.push(file);
    cb();
  });
};
