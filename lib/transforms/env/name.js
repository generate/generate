'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('../../utils');

module.exports = function projectname_() {
  if (this.exists('project.name')) return;

  var name = this.get('package.name');

  if (!name && this.has('bower')) {
    name = this.get('bower.name');
  }

  if (!name) {
    name = path.basename(this.cwd || process.cwd());
  }

  this.set('project.name', name);

  console.log(this.get('project'))
};
