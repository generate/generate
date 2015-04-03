'use strict';

var utils = require('../../utils');
var fs = require('fs');

module.exports = function appname_() {
  var appname = null;
  if (fs.existsSync('bower.json')) {
    appname = require(this.cwd + '/bower.json');
  }
  if (!appname && fs.existsSync('package.json')) {
    appname = require(this.cwd + '/package.json');
  }
  if (!appname) {
    appname = path.dirname(cwd);
  } else {
    appname = appname.name;
  }

  this.data({appname: JSON.stringify(appname)});
};
