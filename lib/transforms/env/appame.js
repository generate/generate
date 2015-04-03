'use strict';

var utils = require('../../utils');
var fs = require('fs');

module.exports = function appname_(generate) {
  var bower = utils.tryReadJson('bower.json');
  // console.log(bower)

  // var appname = this.fs.readJSON(this.paths.dest('bower.json'), {}).name;

  // if (!appname) {
  //   appname = this.fs.readJSON(this.paths.dest('package.json'), {}).name;
  // }

  // if (!appname) {
  //   appname = path.basename(this.destinationRoot());
  // }

  // return appname.replace(/[\W\S]+?/g, ' ');
};
