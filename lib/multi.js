'use strict';

var path = require('path');
var Base = require('base-methods');
var option = require('base-options');
var store = require('base-store');
var fns = require('./middleware');
var tasks = require('./tasks');
var utils = require('./utils');
var Generate = require('..');

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

    this.Generate = Generate;
    this.base = new Generate()
      .on('error', console.error)
      .set('argv', argv);

    // console.log(this.base.cli.keys)

    this.base.use(utils.runtimes());

    // register middleware
    for (var fn in fns) {
      fns[fn](this.base, this.base, this);
    }

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

  Multi.prototype.register = function(name, options, fn) {
    if (arguments.length === 2) {
      fn = options;
      options = {};
    }

    var opts = utils.extend({}, options);
    var base = this.base;

    var Generate = opts.Generate || this.Generate;
    var app = new Generate(opts)
      .option('name', name)
      .option('fullname', opts.fullname || name)
      .option('path', opts.path || '');

    app.create('templates', {
      cwd: path.resolve(opts.path, 'templates'),
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

    // fn is a generator application
    fn.call(app, app, base, this);
    this.base.generator(name, app);

    this.emit('register', name, app);
    return this;
  };

  Multi.prototype.registerEach = function(pattern, config) {
    var files = utils.matchFiles(pattern, config);
    var len = files.length, i = -1;

    while (++i < len) {
      var fp = files[i];
      var filepath = path.resolve(fp, 'generate.js');
      var generate = require(filepath);

      // get the full project name ('generate-foo')
      var fullname = utils.project(fp);

      // get the generate name ('foo')
      var name = utils.renameFn(fullname, config);
      var opts = utils.extend({}, config);

      // get the constructor to use (node_modules or our 'Generate')
      opts.Generate = utils.resolveModule(fp);
      opts.fullname = fullname;
      opts.name = name;
      opts.path = fp;

      this.register(name, opts, generate);
    }
    return this;
  };

  Multi.prototype.argv = function(argv, commands, fn) {
    var args = {};
    args.argv = argv;
    args.commands = [];
    args.generators = {};

    args.flags = utils.expandArgs(utils.omit(argv, ['_', 'files']));
    args.flagskeys = Object.keys(args.flags);

    var files = argv.files ? utils.pick(argv, 'files') : null;
    if (files) args.flags.files = files;

    var arr = argv._;
    var len = arr.length, i = -1;

    while (++i < len) {
      var key = arr[i];

      if (/\W/.test(key)) {
        var obj = utils.expand(key);

        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            var val = obj[key];
            utils.union(args, 'generators.' + key, val);
          }
        }
        continue;
      }

      if (utils.contains(commands, key)) {
        args.commands.push(key);
        continue;
      }
      fn(key, args);
    }
    return args;
  };

  Multi.prototype.run = function(args, cb) {
    if (typeof args === 'function') {
      cb = args;
      args = null;
    }

    var base = this.base;

    if (!args) {
      var argv = base.get('argv');
      var commands = this.options.commands || this.commands;
      args = this.argv(argv, commands, function(key, args) {
        var generators = base.generators;
        if (key in generators) {
          utils.union(args, 'generators.' + key, 'default');

        } else if (key !== 'base') {
          utils.union(args, 'generators.base', key);
        }
        return args;
      }.bind(this));
    }

    if (args.commands && args.commands.length > 1) {
      var cmd = '"' + args.commands.join(', ') + '"';
      return cb(new Error('Error: only one root level command may be given: ' + cmd));
    }

    base.cli.process(args.flags);
    var generators = Object.keys(args.generators);

    utils.async.eachSeries(generators, function(name, next) {
      var tasks = args.generators[name];

      var app = name !== 'base'
        ? base.generator(name)
        : base;

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
