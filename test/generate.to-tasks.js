'use strict';

var assert = require('assert');
var minimist = require('minimist');
var support = require('./support');
var Generate = support.resolve();
var generate;

var toTasks = require('../lib/to-tasks');

describe.skip('to-tasks', function() {
  beforeEach(function() {
    generate = new Generate();
  });

  it('should return default empty objects when only passing in argv as an empty array', function() {
    var tasks = toTasks([]);
    var expected = {
      _: [],
      unknown: ['default'],
      commands: {},
      options: {},
      tasks: []
    };
    assert.deepEqual(tasks, expected);
  });

  it('should return default empty objects with blank unknown when only passing in argv as an empty string', function() {
    var tasks = toTasks('');
    var expected = {
      _: [],
      unknown: [''],
      commands: {},
      options: {},
      tasks: []
    };
    assert.deepEqual(tasks, expected);
  });

  it('should return default empty objects with string in unknown when only passing in argv as a string', function() {
    var tasks = toTasks('foo');
    var expected = {
      _: [],
      unknown: ['foo'],
      commands: {},
      options: {},
      tasks: []
    };
    assert.deepEqual(tasks, expected);
  });

  it('should process an argv object and return all unknowns', function() {
    var argv = minimist(['foo', 'bar', 'baz']);
    var tasks = toTasks(argv);
    var expected = {
      _: [],
      unknown: ['foo', 'bar', 'baz'],
      commands: {},
      options: {},
      tasks: []
    };
    assert.deepEqual(tasks, expected);
  });

  it('should process an argv object with options', function() {
    var argv = minimist(['foo', '--bar', '--baz']);
    var tasks = toTasks(argv);
    var expected = {
      _: [],
      unknown: ['foo'],
      commands: {},
      options: {
        bar: true,
        baz: true
      },
      tasks: []
    };
    assert.deepEqual(tasks, expected);
  });

  it('should process an argv object with commands', function() {
    var argv = minimist(['--tasks']);
    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: ['default'],
      commands: {
        tasks: true
      },
      options: {},
      tasks: []
    };
    assert.deepEqual(tasks, expected);
  });

  it('should process an argv object with commands without using --', function() {
    var argv = minimist(['tasks']);
    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: ['tasks'],
      commands: {},
      options: {},
      tasks: []
    };
    assert.deepEqual(tasks, expected);
  });

  it('should process an argv object with a generator specified', function() {
    var argv = minimist(['foo:bar']);
    generate.register('foo', function(app) {
      app.task('bar', function() {});
    });

    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: [],
      commands: {},
      options: {},
      tasks: ['generators.foo:bar']
    };
    assert.deepEqual(tasks, expected);
  });

  it('should process an argv object with many generators specified', function() {
    var argv = minimist(['foo:bar', 'beep:boop']);
    generate.register('foo', function(app) {
      app.task('bar', function() {});
    });

    generate.register('beep', function(app) {
      app.task('boop', function() {});
    });

    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: [],
      commands: {},
      options: {},
      tasks: [
        'generators.foo:bar',
        'generators.beep:boop'
      ]
    };
    assert.deepEqual(tasks, expected);
  });

  it('should process an argv object with deeply nested generators specified', function() {
    var argv = minimist(['foo.beep:boop']);
    generate.register('foo', function(app) {
      app.task('bar', function() {});
      app.register('beep', function(app) {
        app.task('boop', function() {});
      });
    });


    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: [],
      commands: {},
      options: {},
      tasks: ['generators.foo.generators.beep:boop']
    };
    assert.deepEqual(tasks, expected);
  });

  it('should process an argv object with deeply nested generators and many tasks specified', function() {
    var argv = minimist(['foo.beep:boop,bop', 'foo:bar,baz']);
    generate.register('foo', function(app) {
      app.task('bar', function() {});
      app.task('baz', function() {});
      app.register('beep', function(app) {
        app.task('boop', function() {});
        app.task('bop', function() {});
      });
    });


    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: [],
      commands: {},
      options: {},
      tasks: [
        'generators.foo.generators.beep:boop,bop',
        'generators.foo:bar,baz'
      ]
    };
    assert.deepEqual(tasks, expected);
  });

  it('should process an argv object with only a task specified', function() {
    var argv = minimist(['bar']);
    generate.task('bar', function() {});
    generate.task('baz', function() {});

    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: [],
      commands: {},
      options: {},
      tasks: ['bar']
    };
    assert.deepEqual(tasks, expected);
  });

  it('should process an argv object with many tasks specified', function() {
    var argv = minimist(['bar', 'baz']);
    generate.task('bar', function() {});
    generate.task('baz', function() {});

    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: [],
      commands: {},
      options: {},
      tasks: ['bar', 'baz']
    };
    assert.deepEqual(tasks, expected);
  });

  it('should process an argv object with many comma separated tasks specified', function() {
    var argv = minimist(['bar,baz']);
    generate.task('bar', function() {});
    generate.task('baz', function() {});

    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: [],
      commands: {},
      options: {},
      tasks: ['bar,baz']
    };
    assert.deepEqual(tasks, expected);
  });

  it('should fallback to a "base" task', function() {
    var argv = minimist(['default']);
    generate.register('base', function(app) {
      app.task('default', function() {});
    });
    generate.task('bar', function() {});
    generate.task('baz', function() {});

    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: [],
      commands: {},
      options: {},
      tasks: ['generators.base:default']
    };
    assert.deepEqual(tasks, expected);
  });

  it('should fallback to a nested generator "default" task', function() {
    var argv = minimist(['foo']);
    generate.register('base', function(app) {
      app.task('default', function() {});
    });
    generate.register('foo', function(app) {
      app.task('default', function() {});
    });
    generate.task('bar', function() {});
    generate.task('baz', function() {});

    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: [],
      commands: {},
      options: {},
      tasks: ['generators.foo:default']
    };
    assert.deepEqual(tasks, expected);
  });

  it('should fallback to a nested generator "default" task', function() {
    var argv = minimist(['foo']);
    generate.register('base', function(app) {
      app.task('default', function() {});
    });
    generate.register('foo', function(app) {
      app.task('default', function() {});
    });
    generate.task('bar', function() {});
    generate.task('baz', function() {});

    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: [],
      commands: {},
      options: {},
      tasks: ['generators.foo:default']
    };
    assert.deepEqual(tasks, expected);
  });

  it('should fallback to root generator when task has a dot', function() {
    var argv = minimist(['foo:bar.2']);
    generate.register('base', function(app) {
      app.task('default', function() {});
    });
    generate.register('foo', function(app) {
      app.task('default', function() {});
    });
    generate.task('bar', function() {});
    generate.task('baz', function() {});
    generate.task('bar.2', function() {});

    var tasks = toTasks(argv, generate);
    var expected = {
      _: [],
      unknown: [],
      commands: {},
      options: {},
      tasks: ['bar.2']
    };
    assert.deepEqual(tasks, expected);
  });

  it('should throw an error when a task is not found', function(done) {
    var argv = minimist(['bar,nothing']);
    generate.task('bar', function() {});
    generate.task('baz', function() {});

    try {
      var tasks = toTasks(argv, generate);
      done(new Error('expected an error when a task is not found.'));
    } catch (err) {
      assert.equal(err.message, 'task "nothing" is not registered');
      done();
    }
  });

  it('should throw an error when a task on a sub generator is not found', function(done) {
    var argv = minimist(['beep:boop,nothing']);
    generate.task('bar', function() {});
    generate.task('baz', function() {});
    generate.register('beep', function(app) {
      app.task('boop', function() {});
    });

    try {
      var tasks = toTasks(argv, generate);
      console.log(tasks);
      done(new Error('expected an error when a task is not found.'));
    } catch (err) {
      assert.equal(err.message, 'task "beep:nothing" is not registered on generator "beep"');
      done();
    }
  });

  it('should throw an error when a sub generator is not found', function(done) {
    var argv = minimist(['bep:boop,nothing']);
    generate.task('bar', function() {});
    generate.task('baz', function() {});
    generate.register('beep', function(app) {
      app.task('boop', function() {});
    });

    try {
      var tasks = toTasks(argv, generate);
      console.log(tasks);
      done(new Error('expected an error when a task is not found.'));
    } catch (err) {
      assert.equal(err.message, 'task "bep:boop" is not registered on generator "bep"');
      done();
    }
  });
});
