'use strict';

var path = require('path');
var fs = require('fs');

module.exports = function appname_() {
  var name = this.get('data.appname');

  if (fs.existsSync('bower.json')) {
    name = require(this.cwd + '/bower.json');
  }
  if (!name && fs.existsSync('package.json')) {
    name = require(this.cwd + '/package.json');
  }

  var cwd = this.cwd || process.cwd();
  if (typeof name === 'object') {
    name = name.name;
  } else {
    name = path.basename(path.dirname(cwd));
  }

  name = name.split('generate-').join('');
  this.data({appname: name});
};
