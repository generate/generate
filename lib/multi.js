'use strict';

var path = require('path');
var Base = require('base-methods');
var option = require('base-options');
var store = require('base-store');
// var fns = require('./middleware');
var tasks = require('./tasks');
var utils = require('./utils');
var Generator = require('..');

module.exports = function(namespace, config) {
  function Multi(argv, options) {
    if (!(this instanceof Multi)) {
      return new Multi(argv, options);
    }

    Base.call(this);
    this.use(option());
    this.use(store());

    this.options = options || {};
    this.commands = ['set', 'get', 'del', 'store', 'init', 'option', 'data', 'list'];

    this.base = new Generator()
      .on('error', console.error)
      .set('argv', argv);

    console.log()

    this.base.use(utils.runtimes());

    // register middleware
    // for (var fn in fns) {
    //   fns[fn](this.base, this.base, this);
    // }

    // register tasks
    for (var key in tasks) {
      this.base.task(key, tasks[key](this.base, this.base, this));
    }
    this._listen();
  }

  Base.extend(Multi);

  Multi.prototype.generator = function(name) {
    return this.base.generator(name);
  };

  Multi.prototype.build = function() {
    this.base.build.apply(this.base, arguments);
    return this;
  };

  Multi.prototype._listen = function() {
    if (this.base.disabled('verbose')) return;
    var store = ['store.set', 'store.has', 'store.get', 'store.del'];
    var methods = ['set', 'has', 'get', 'del', 'option', 'data'];

    var names = store.concat(methods);
    var len = names.length, i = -1;
    var multi = this;

    while (++i < len) {
      var method = names[i];
      var prop = method.split('.');

      if (prop.length === 2) {
        this.base[prop[0]].on(prop[1], multi.emit.bind(multi, method));
        this.base[prop[0]].on(prop[1], multi.emit.bind(multi, '*', method));
      } else {
        this.base.on(method, function(key, val) {
          multi.emit(method, key, val);
          multi.emit('*', method, key, val);
        });
      }
    }
  };

  Multi.prototype.register = function(name, options, generate) {
    if (arguments.length === 2) {
      generate = options;
      options = {};
    }

    var Ctor = options.Generator || Generator;
    var base = this.base;

    var app = new Ctor(base.options)
      .option('name', name)
      .option('fullname', options.fullname || name)
      .option('path', options.path || '');

    app.create('templates', {
      cwd: path.resolve(options.path, 'templates'),
      renameKey: function (key) {
        return path.basename(key);
      }
    });

    app.define('getFile', function(name) {
      var view = base.files.getView.apply(base.files, arguments);
      if (!view) {
        view = app.templates.getView.apply(app.templates, arguments);
      }
      view.basename = view.basename.replace(/^_/, '.');
      return view;
    });

    base.define('getFile', app.getFile);
    base.files.getFile = base.files.getView.bind(base.files);

    generate.call(app, app, base, this);
    base.generator(name, app);

    this.emit('register', name, app);
    return this;
  };

  Multi.prototype.registerEach = function(pattern, options) {
    utils.matchFiles(pattern, options).forEach(function (fp) {
      var filepath = path.resolve(fp, 'generate.js');
      var generate = require(filepath);

      // get the full project name ('generate-foo')
      var fullname = utils.project(fp);
      console.log(fullname)
      // get the generate name ('foo')
      var name = utils.renameFn(fullname, options);
      var opts = {};
      // get the constructor to use (node_modules or our 'Generator')
      opts.Generator = utils.resolveModule(fp);
      opts.fullname = fullname;
      opts.path = fp;

      this.register(name, opts, generate);
    }.bind(this));

    this.base.emit('registered');
    return this;
  };

  Multi.prototype.argv = function(argv, commands, generators) {
    var res = {};
    res.generators = generators;
    res.argv = argv;
    res.commands = [];
    res.generators = {};

    var files = argv.files ? utils.pick(argv, 'files') : null;
    res.flags = utils.expandArgs(utils.omit(argv, ['_', 'files']));
    if (files) res.flags.files = files;
    res.flagskeys = Object.keys(res.flags);

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

      if (utils.contains(commands, ele)) {
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

  Multi.prototype.run = function(args, cb) {
    if (typeof args === 'function') {
      cb = args;
      args = null;
    }

    if (!args) {
      var argv = this.base.get('argv');
      var commands = this.options.commands || this.commands;
      args = this.argv(argv, commands, this.base.generators);
    }

    if (args.commands && args.commands.length > 1) {
      var cmd = '"' + args.commands.join(', ') + '"';
      return cb(new Error('Error: only one root level command may be given: ' + cmd));
    }

    this.base.cli.process(args.flags);
    var generators = Object.keys(args.generators);

    utils.async.eachSeries(generators, function(name, next) {
      var tasks = args.generators[name];
      var app = name !== 'base'
        ? this.base.generator(name)
        : this.base;

      app.cwd = path.resolve(app.options.path, 'templates');

      this.emit('task', name, tasks);
      app.build(tasks, function (err) {
        if (err) return next(err);
        next();
      });
    }.bind(this), cb);
    return this;
  };

  Multi.prototype.hasGenerator = function(name) {
    return this.generators.hasOwnProperty(name);
  };

  Multi.prototype.hasTask = function(name) {
    return this.taskMap.indexOf(name) > -1;
  };

  Multi.prototype.list = function(cb) {
    var questions = utils.questions(this.base.options);
    var choices = utils.list(this.base.generators);
    if (!choices.length) {
      console.log(utils.cyan(' No generator tasks found.'));
      return cb(null, {generators: {}});
    }

    var question = {
      generators: {
        message: 'pick an generator to run',
        type: 'checkbox',
        choices: choices
      }
    };

    questions.ask(question, function (err, answers) {
      if (err) return cb(err);
      var args = {
        generators: {}
      };
      answers.generators.forEach(function (answer) {
        var segs = answer.split(':');
        if (segs.length === 1) return;
        utils.union(args.generators, segs[0], (segs[1] || 'default').split(','));
      });
      return cb(null, args);
    });
  };

  /**
   * Expose `Multi`
   */

  return Multi;
};
