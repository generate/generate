'use strict';

var path = require('path');
var fs = require('fs');

module.exports = function appname_() {
  var appname = this.get('data.appname');

  if (fs.existsSync('bower.json')) {
    appname = require(this.cwd + '/bower.json');
  }
  if (!appname && fs.existsSync('package.json')) {
    appname = require(this.cwd + '/package.json');
  }

  appname = appname ? appname.name : path.dirname(this.cwd);
  appname = appname.split('generate-').join('');
  this.data({appname: appname});
};
