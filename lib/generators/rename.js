
var fs = require('fs');
var async = require('async');
var green = require('ansi-green');
var success = require('success-symbol');

function renameFiles(files, cb) {
  async.eachSeries(Object.keys(files), function (key, next) {
    fs.rename(key, files[key], next);
  }, cb);
}

var files = {
  'LICENSE-MIT': 'LICENSE',
  '.verbrc.md': '.verb.md',
  'README.md': 'readme.md'
};

renameFiles(files, function(err) {
  if (err) {
    if (err.code !== 'ENOENT') {
      console.error(err);
    }
    return;
  }
  var keys = Object.keys(files);
  var len = keys.length;
  console.log(green(success), ' renamed ' + len, 'files');
});
