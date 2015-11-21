'use strict';

var utils = require('./utils');

module.exports = function (argv, options) {
  return function(app) {

    var generators = Object.keys(this.generators);
    var tasks = Object.keys(this.tasks);


    app.argv = function(key) {
      var config = {
        argv: argv,
        _: [],
        tasks: [],
        generators: [],
        flags: {}
      };

      var len = argv._.length, i = -1;
      while (++i < len) {
        var arg = argv._[i];

        var segs = arg.split(':');
        if (segs.length > 1) {
          var key = segs[0];
          var val = segs[1];

          if (tasks.indexOf(key) > -1) {
            config.tasks.push(key);
          } else if (generators.indexOf(key) > -1) {
            config.generators.push(key);
          } else {
            config._.push(key);
          }

        } else {
          if (tasks.indexOf(arg) > -1) {
            config.tasks.push(arg);
          } else if (generators.indexOf(arg) > -1) {
            config.generators.push(arg);
          } else {
            config._.push(arg);
          }
        }
      }

      // return utils.get(config, key);
      return config;
    };
  }
};

