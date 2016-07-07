# Introduction to Generators

Learn how to create, register and run generators.

- [TODO](#todo)
- [What is a generator?](#what-is-a-generator)
- [Creating generators](#creating-generators)
- [Registering generators](#registering-generators)
  * [Namespacing](#namespacing)
- [Running generators](#running-generators)
- [Resolving generators](#resolving-generators)
  * [Tasks and generators](#tasks-and-generators)
  * [Naming tips](#naming-tips)
  * [Order of precendence](#order-of-precendence)
- [Discovering generators](#discovering-generators)
- [Default generator](#default-generator)
- [Generators versus plugins](#generators-versus-plugins)

## TODO

* [ ] document generator args
* [ ] explain how the `base` instance works
* [ ] document `env`

**Prerequisites**

* If you're not familiar with plugins yet, it might be a good idea to review the [plugins docs](api/plugins.md) first.

## What is a generator?

Generators provide a convenient way of "wrapping" code that should be executed on-demand, whilst also _namespacing_ the code being wrapped, so that it can be explicitly targeted via CLI or API using a consistent and intuitive syntax.

You can also think of generators as "containers for tasks". For example, this is how you

## Creating generators

Generators are [plugins](api/plugins.md) that are registered by name. The only difference between a _generator_ and a plugin is how they are registered.

**Example**

Given this function:

```js
function foo(app) {
}

// use as a plugin
app.use(foo);
// register as a generator
app.register('my-generator', foo);
```

## Registering generators

When a generator is registered using the `.register` method, it's added to the `app.generators` object.

```js
app.register('my-generator', function() {});
console.log(app.generators);
{'my-generator': {...}};
```

### Namespacing

When the generator is registered with the `.register` methodThe first difference between

Generators may be registered using either of the following methods:

* `.register`: if the plugin should not be invoked until it's called by `.generate` (stays lazy while it's cached, this is preferred)
* `.generator`: if the plugin needs to be invoked immediately when registered

**Example**

```js
var generate = require('generate');
var app = generate();

function generator(app) {
  // do generator stuff
}

// register as a generator
app.register('foo', generator);

// or register as a plugin
app.use(generator);
```

**Should I use `.generator` or `.register`?**

In general, it's recommended that you use the `.register` method. In most cases generate is smart enough to figure out when to invoke generator functions.

However, there are always exceptions. If you create custom code and notice that generate can't find the information it needs. Try using the `.generator` method to to invoke the function when the generator is registered.

## Running generators

Generators and their tasks can be run by command line or API.

**Command line**

To run globally or locally installed `generator-foo`, or a generator named `foo` in `generator.js`, run:

```sh
$ gen foo
```

<a name="cli-default-task"></a>

**"default" task**

If `generator-foo` has a `default` task it will automatically be executed when the `$ gen foo` command is given. If a `default` task is not defined, the generator function is simply invoked.

**API**

```js
var generate = require('generate');
var app = generate();

function fn() {
  // do generator stuff
}

// the `.register` method does not invoke the generator
app.register('foo', fn);

// the `.generator` method invokes the generator immediately
app.generator('bar', fn);

// run generators foo and bar in series (both generators will be invoked)
app.generate(['foo', 'bar'], function(err) {
  if (err) return console.log(err);
});
```

## Resolving generators

Generators can be published to npm and installed globally or locally. But you there is no requirement that generators must be published. You can also create custom generators and register them using the [.register](#register) or [.generator](#generator) methods.

This provides a great deal of flexibility, but it also means that we need a strategy for _finding generators_ when `generate` is run from the command line.

### Tasks and generators

1. When both a task and a generator have the same name _on the same instance_, Generate will always try to run the task first (this is unlikely to happen unless you intend for it to - there are [reasons to do this](#naming-tips))

### Naming tips

Since the [.build](tasks.md#build) method only runs tasks, you can use this to your advantage by aliasing sub-generators with tasks.

**Don't do this**

```js
module.exports = function(app) {
  app.register('foo', function(foo) {
    foo.task('default', function(cb) {
      // do task stuff
      cb();
    });
  });

  // `.build` doesn't run generators
  app.build('foo', function(err) {
    if (err) return console.log(err);
  });
};
```

**Do this**

```js
module.exports = function(app) {
  app.register('foo', function(foo) {
    foo.task('default', function(cb) {
      // do task stuff
      cb();
    });
  });

  // `.build` doesn't run generators
  app.generate('foo', function(err) {
    if (err) return console.log(err);
  });
};
```

**Or this**

```js
module.exports = function(app) {
  app.register('foo', function(foo) {
    foo.task('default', function(cb) {
      // do task stuff
      cb();
    });
  });

  app.task('foo', function(cb) {
    app.generate('foo', cb);
  });

  // `.build` will run task `foo`, which runs the generator
  app.build('foo', function(err) {
    if (err) return console.log(err);
  });
};
```

### Order of precendence

When the command line is used, Generate's CLI resolves generators in the following order:

1. [default generator](#default-generator): attempts to match given names to generators and tasks registered on the `default` generator
2. built-in generators: attempts to match given names to Generate's [built-in generators](cli/built-in-generators.md)
3. locally installed generators
4. globally installed generators

## Discovering generators

todo

## Default generator

If a generator is registered with the name `default` it will receive special treatment from Generate and Generate's CLI. More specifically, when Generate's CLI looks for generators or tasks to run, it will search for them on the `default` generator first.

There is a catch...

**Registering the "default" generator**

_The only way to register a `default` generator is by creating an [generator.js](generator-js.md) in the current working directory._

When used by command line, Generate's CLI will then use node's `require()` system to get the function exported by `generator.js` and use it as the `default` generator.

## Generators versus plugins

The primary difference between "generators" and "plugins" is how they're registered, but there are a few other minor differences:

|  | **Plugin** | **Generator** | 
| --- | --- | --- | --- | --- | --- | --- |
| Registered with | [.use](plugins.md#use) method | [.register](#register) method or [.generator](#generator) method |
| Instance | Loaded onto "current" `Generate` instance | A `new Generate()` instance is created for every generator registered |
| Invoked | Immediately | `.register` deferred (lazy), `.generator` immediately |
| Run using | [.run](plugins.md#run): all plugins are run at once | `.generate`: only specified plugin(s) are run |

## Related

**Docs**

* [tasks](tasks.md)
* [generator-js](generator-js.md)
* [installing-generators](installing-generators.md)
* [symlinking-generators](symlinking-generators.md)
* [sub-generators](sub-generators.md)
