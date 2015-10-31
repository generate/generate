'use strict';

var path = require('path');
var tasks = require('./tasks');
var utils = require('./utils');
var Generate = require('..');

function Generators(argv, options) {
  if (!(this instanceof Generators)) {
    return new Generators(argv);
  }

  this.options = options || {};
  this.base = new Generate()
    .on('error', console.error)
    .use(utils.runtimes())
    .set('argv', argv);

  for (var key in tasks) {
    this.base.task(key, tasks[key](this.base, this));
  }
}

Generators.prototype.argv = function(argv, whitelist, generators) {
  var res = {};
  res.whitelist = whitelist;
  res.generators = generators;
  res.argv = argv;
  res.commands = [];
  res.generators = {};
  res.flags = utils.expandArgs(utils.omit(argv, '_'));

  var arr = argv._;
  var len = arr.length, i = -1;

  while (++i < len) {
    var ele = arr[i];

    if (/\W/.test(ele)) {
      var obj = utils.expand(ele);
      utils.forOwn(obj, function (val, key) {
        utils.union(res.generators, key, val);
      });
      continue;
    }

    if (utils.contains(whitelist, ele)) {
      res.commands.push(ele);
      continue;
    }

    if (ele in generators) {
      utils.union(res.generators, ele, 'default');

    } else if (ele !== 'base') {
      utils.union(res.generators, 'base', ele);
    }
  }
  return res;
};

Generators.prototype.register = function(pattern, options) {
  utils.matchFiles(pattern, options).forEach(function (fp) {
    var fullname = utils.projectName(fp);
    var name = utils.renameFn(fullname, options);
    var mod = utils.resolveModule(fp) || Generate;
    var app = mod(this.base.options)
      .option('name', name)
      .set('fullname', fullname)
      .set('path', fp);

    var filepath = path.join(fp, 'generator.js');

    require(filepath)(app, this);
    this.base.generator(name, app);
  }.bind(this));
  return this;
};

Generators.prototype.run = function(args, cb) {
  if (typeof args === 'function') {
    cb = args;
    args = null;
  }

  if (!args) {
    var whitelist = this.options.whitelist;
    if (!whitelist) {
      whitelist = ['set', 'get', 'del', 'store', 'init'];
    }
    var argv = this.base.get('argv');
    args = this.argv(argv, whitelist, this.base.generators);
  }

  if (args.commands && args.commands.length > 1) {
    var cmd = '"' + args.commands.join(', ') + '"';
    return cb(new Error('Error: only one root level command may be given: ' + cmd));
  }

  var generators = Object.keys(args.generators);

  utils.async.eachSeries(generators, function(name, next) {
    var tasks = args.generators[name];
    var app = name !== 'base'
      ? this.base.generator(name)
      : this.base;

    app.build(tasks, function (err) {
      if (err) return next(err);
      next();
    });
  }.bind(this), cb);
  return this;
};

Generators.prototype.list = function(cb) {
  var questions = utils.questions(this.base.options);
  var question = {
    generators: {
      message: 'pick a generator to run',
      type: 'checkbox',
      choices: utils.list(this.base.generators)
    }
  };
  questions.ask(question, function (err, answers) {
    if (err) return cb(err);
    var args = {
      generators: {}
    };
    answers.generators.forEach(function (answer) {
      var segs = answer.split(':');
      utils.union(args.generators, segs[0], (segs[1] || 'default').split(','));
    });
    return cb(null, args);
  });
};

/**
 * Expose `Generators`
 */

module.exports = Generators;
