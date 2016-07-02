'use strict';

var path = require('path');
var utils = require('./utils');

exports.buildPaths = function(dest) {
  var paths = {api: [], cli: [], docs: [], url: [], path: [], dest: [], anchors: {}};
  var files = [];

  return utils.through.obj(function(file, enc, next) {
    setDir(file, paths);
    getAnchors(file, paths);
    createDest(file, paths, dest);
    paths.path.push(file.path);
    files.push(file);
    next();
  }, function(cb) {
    var len = files.length;
    var idx = -1;
    while (++idx < len) {
      var file = files[idx];
      getLinks(file, paths);
      file.paths = paths;
      this.push(file);
    }
    cb();
  });
};

exports.lintPaths = function(dest) {
  return utils.through.obj(function(file, enc, next) {
    // console.log(file.paths);
    next(null, file);
  });
};

function setDir(file, paths) {
  file.name = file.stem;
  var segs = file.relative.split('/');
  var dir = 'docs';
  var rest = file.relative;
  if (segs.length > 1) {
    dir = segs.shift();
    rest = segs.join('/');
  }
  paths[dir] = paths[dir] || [];
  paths[dir].push(rest);
  file.rest = rest;
  file.dir = dir;
}

function createDest(view, paths, dest) {
  var file = view.clone();
  file.dirname = path.join(file.dirname, file.stem);
  file.basename = 'index.html';
  paths.dest.push(path.resolve(dest, file.relative));
}

function getAnchors(file, paths) {
  var str = file.contents.toString();
  var matches = str.match(/^#+\s+([^\n]+)/gm);
  if (matches) {
    paths.anchors[file.rest] = paths.anchors[file.rest] || [];
    matches.reduce(function(acc, str) {
      var anchor = utils.slugify(str.replace(/^#+\s+/, ''));
      if (acc.indexOf(anchor) === -1) {
        acc.push(anchor);
      }
      return acc.sort();
    }, paths.anchors[file.rest]);
  }
}

function getLinks(file, paths) {
  var md = new utils.Remarkable({paths: paths, file: file});
  md.use(utils.prettify);
  md.use(utils.lintLinks);
  md.render(file.content);
}

