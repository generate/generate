/*!
 * generate <https://github.com/jonschlinkert/generate>
 *
 * Copyright (c) 2015-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var debug = require('debug')('generate');
var Assemble = require('assemble-core');
var plugins = require('./lib/plugins');
var utils = require('./lib/utils');
var args = process.argv.slice(2);
var argv = utils.parseArgs(args);
var setArgs;

/**
 * Create an instance of `Generate` with the given `options`
 *
 * ```js
 * var Generate = require('generate');
 * var generate = new Generate();
 * ```
 * @param {Object} `options` Settings to initialize with.
 * @api public
 */

function Generate(options) {
  if (!(this instanceof Generate)) {
    return new Generate(options);
  }

  Assemble.call(this, options);
  this.paths = this.paths || {};
  this.is('generate');
  this.initGenerate(this.options);
  debug('initializing');

  if (!setArgs) {
    setArgs = true;
    this.base.option(argv);
  }
}

/**
 * Extend `Generate`
 */

Assemble.extend(Generate);

/**
 * Initialize Stores
 */

plugins.stores(Generate.prototype);

/**
 * Initialize generate defaults
 */

Generate.prototype.initGenerate = function(opts) {
  Generate.emit('generate.preInit', this);
  this.set('aliasRegex', /^(assemble(?:-generate)?|base|generate|helper|updater|verb(?:-generate)?)-/);
  var self = this;

  // custom lookup function for resolving generators
  this.option('lookup', Generate.lookup);

  // custom `toAlias` function for resolving generators by alias
  this.option('toAlias', function(key) {
    return key.replace(self.get('aliasRegex'), '');
  });

  // format help menu
  this.option('help', {
    command: 'gen',
    configname: 'generator',
    appname: 'generate'
  });

  this.define('home', function() {
    var args = [].slice.call(arguments);
    return path.resolve.apply(path, [os.homedir(), 'update'].concat(args));
  });

  Object.defineProperty(this.paths, 'dest', {
    configurable: true,
    set: function(val) {
      self.cache.dest = val;
    },
    get: function() {
      return path.resolve(argv.dest || self.cache.dest || self.options.dest || self.cwd);
    }
  });

  // register async `ask` helper
  this.asyncHelper('ask', utils.ask(this));

  // load plugins
  this.common = utils.common;
  this.use(plugins.store('generate'));
  this.use(plugins.generators());
  this.use(plugins.pipeline());
  this.use(utils.askWhen());

  // load listeners
  Generate.initGenerateListeners(this);

  // load middleware
  if (!process.env.GENERATE_TEST) {
    Generate.initGenerateMiddleware(this);
  }

  // load CLI plugins
  if (utils.runnerEnabled(this)) {
    this.initGenerateCLI(opts);
  }

  Generate.emit('generate.postInit', this);
};

/**
 * Initialize CLI-specific plugins and view collections.
 */

Generate.prototype.initGenerateCLI = function(options) {
  Generate.initGenerateCLI(this, options);
};

/**
 * Temporary error handler method. until we implement better errors.
 *
 * @param {Object} `err` Object or instance of `Error`.
 * @return {Object} Returns an error object, or emits `error` if a listener exists.
 */

Generate.prototype.handleErr = function(err) {
  return Generate.handleErr(this, err);
};

/**
 * Initialize middleware
 */

Generate.initGenerateMiddleware = function(app) {
  app.preWrite(/./, function(view, next) {
    var askName = view.data && view.data.ask;
    var hint = view.basename;
    if (utils.isObject(askName)) {
      var obj = askName;
      hint = obj.default || hint;
      askName = obj.rename;
    }

    function setValue(obj) {
      var key = askName;
      var val = obj[key];
      if (val) view[key] = val;
      if (key === 'path') {
        view.base = path.dirname(view.path);
        app.options.dest = view.base;
      }
    }

    if (typeof askName === 'string') {
      var argv = app.get('cache.argv') || {};
      if (argv[askName]) {
        setValue(argv);
        next();
        return;
      }

      app.question(askName, `What is the file.${askName}?`, {default: hint});
      app.askWhen(askName, {save: false}, function(err, answers) {
        if (err) return next(err);
        if (answers[askName]) {
          setValue(answers);
        }
        next();
      });
    } else {
      next();
    }
  });

  app.preRender(/./, utils.renameFile(app));
  app.preWrite(/./, utils.renameFile(app));
  app.onLoad(/(^|[\\\/])templates[\\\/]/, function(view, next) {
    var userDefined = app.home('generate/templates', view.basename);
    if (utils.exists(userDefined)) {
      view.contents = fs.readFileSync(userDefined);
    }

    if (utils.exists(userDefined)) {
      view.contents = fs.readFileSync(userDefined);
    }

    if (/^templates[\\\/]/.test(view.relative)) {
      view.path = path.join(app.cwd, view.basename);
    }

    utils.stripPrefixes(view);
    utils.parser.parse(view, next);
  });
};

/**
 * Initialize listeners
 */

Generate.initGenerateListeners = function(app) {
  app.on('option', function(key, val) {
    if (key === 'dest') {
      app.base.cwd = val;
      app.cwd = val;
    }
  });

  app.on('task', function(event, task) {
    if (task && task.app) {
      task.app.cwd = app.base.cwd;
    }
  });

  app.on('unresolved', function(search, app) {
    var resolved = utils.resolve.file(search.name) || utils.resolve.file(search.name, {cwd: utils.gm});
    if (resolved) {
      search.app = app.generator(search.name, require(resolved.path));
    }
  });
};

/**
 * Initialize plugins for CLI
 */

Generate.initGenerateCLI = function(app, options) {
  var opts = {globals: this.globals, store: this.store};
  plugins.runner.loadPlugins(app);
  app.use(plugins.logger());
  app.use(plugins.questions(opts));
  app.use(plugins.rename({replace: true}));
  app.use(plugins.conflicts(options));
  app.use(plugins.runtimes(options));
  app.use(plugins.loader());
  app.use(plugins.npm());
  app.use(plugins.prompt());

  // built-in view collections
  app.create('templates');
};

/**
 * Temporary error handler method. until we implement better errors.
 *
 * @param {Object} `err` Object or instance of `Error`.
 * @return {Object} Returns an error object, or emits `error` if a listener exists.
 */

Generate.handleErr = function(app, err) {
  if (!(err instanceof Error)) {
    err = new Error(err.toString());
  }

  if (utils.isObject(app) && app.isApp) {
    if (app.options.verbose) {
      err = err.stack;
    }

    if (app.hasListeners('error')) {
      app.emit('error', err);
    } else {
      throw err;
    }
  } else {
    throw err;
  }
};

/**
 * Custom lookup function for resolving generators
 */

Generate.lookup = function(key) {
  var re = /^generate-/;
  if (/generate-/.test(key)) {
    return [key, key.replace(re, '')];
  }
  var patterns = [`generate-${key}`];
  if (re.test(key) && !/^(verb|assemble|updater)-/.test(key)) {
    patterns.unshift(key);
  }
  return patterns;
};

/**
 * Setup listeners
 */

Generate.logTasks = function(base, argv) {
  function logger() {
    if (argv.silent || base.options.silent) return;
    console.log.apply(console, arguments);
  }

  base.on('build', function(event, build) {
    if (build && event === 'starting' || event === 'finished') {
      if (build.isSilent) return;
      var prefix = event === 'finished' ? utils.log.success + ' ' : '';
      var key = build.key.replace(/generate\./, '');
      logger(utils.log.timestamp, event, key, prefix + utils.log.red(build.time));
    }
  });

  base.on('task', function(event, task) {
    if (task && event === 'starting' || event === 'finished') {
      if (task.isSilent) return;
      var key = task.key.replace(/generate\./, '');
      logger(utils.log.timestamp, event, key, utils.log.red(task.time));
    }
  });
};

/**
 * Expose the `Generate` constructor
 */

module.exports = Generate;
