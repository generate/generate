'use strict';


var config = require('map-config');
var isObject = require('isobject');
var Config = require('map-config');
var utils = require('../utils');

module.exports = function (options) {
  return function (app) {
    var config = app.locals.cache;
    var keys = Object.keys(app.views);
    var views = {};

    keys.forEach(function (key) {
      var instance = app[key];

      views[key] = function (config) {
        var mapper = new Config({
          options: 'option',
          set: 'set',
          addViews: 'addViews'
        }, instance);

        console.log('loading templates from config: "' + key + '"');
        return mapper.process(config);
      };
    });

    var collections = new Config(views);
    var configMap = new Config({
      plugins: function (config) {
        utils.forOwn(config, function (val, key) {
          var opts = utils.extend({}, app.options, val);
          app.use(require(key)(opts));
        });
      },
      collections: function (config) {
        return collections.process(config);
      },
      helpers: 'helpers',
      asyncHelpers: 'asyncHelpers'
    }, app);

    configMap.process(config);
  };
};

// module.exports = function(options) {
//   return function(app) {
//     app.cli = config(app)
//       .alias('show', 'get')
//       .map('store', store(app.store))
//       .map('option')
//       .map('data')
//       .map('set')
//       .map('del')
//       .map('get')
//       .map('has');

//     app.on('argv', function(argv) {
//         app.cli.process(argv);
//       })
//       .on('get', console.log)
//       .on('has', console.log);
//   };
// };

// function store(app) {
//   var res = config(app)
//     .alias('show', 'get')
//     .map('set')
//     .map('del')
//     .map('has', function(key) {
//       console.log(!!app.get(key));
//     })
//     .map('get', function(key) {
//       console.log(app.get(key));
//     });

//   app.on('del', function (keys) {
//     console.log('deleted:', '[' + keys.join(', ') + ']');
//   });

//   return function(argv) {
//     res.process(argv);
//   };
// }


// function arrayify(val) {
//   return Array.isArray(val) ? val : [val];
// }
