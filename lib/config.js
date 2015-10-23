'use strict';


var expand = require('expand-args');
var config = require('map-config');


module.exports = function(app) {
  var res = config(app)
    .map('store', store(app.store))
    .map('set')
    .map('del')
    .map('get', function(key) {
      console.log(app.get(key));
    });

  app.on('argv', function(argv) {
    res.process(expand(argv));
  });
};

// function init(app) {
//   app.question('')
// }

function store(app) {
  var res = config(app)
    .map('set')
    .map('del')
    .map('has', function(key) {
      console.log(!!app.get(key));
    })
    .map('get', function(key) {
      console.log(app.get(key));
    })

  return function(args) {
    res.process(expand(args));
  };
}
