'use strict';

var utils = require('../utils');

module.exports = function(app) {
  return function(val) {
    if (val === true) {
      app.enable('questions.init');
      return;
    }

    if (utils.isObject(val)) {
      var keys = Object.keys(utils.tableize(val));
      app.questions.enqueue(keys);
      app.option('questions.init', keys);
      return;
    }

    var vals = utils.arrayify(val);
    app.questions.enqueue(vals);
    app.option('questions.init', vals);
  };
};
