# generate [![NPM version](https://badge.fury.io/js/generate.svg)](http://badge.fury.io/js/generate)

> Fast, composable, highly extendable project generator for node.js

**TODO**

* [x] publish a fast, composable, highly extendable project generator with a user-friendly and expressive API
* [x] support sub-generators (to any level of nesting)
* [x] support streams, tasks, and plugins compatible with both [gulp](http://gulpjs.com) and [assemble](https://github.com/assemble/assemble-core)
* [x] make it super easy to run specific tasks from any generator or sub-generator, programmatically or via CLI
* [x] support _instance plugins_ that allow you to easily add functionality and features to generate
* [x] support any template engine
* [x] support using any number of template engines at once, so that different file types can simultaneously be handled by the engine that was registered for that file type
* [x] support templates as [vinyl](http://github.com/gulpjs/vinyl) files, simple to use template collections and lists (for pagination, sorting, groups etc)
* [x] support middleware that can be run on all files or specific files, and at specific points during the _build process_ (like `onLoad`, `preRender`, `postRender`, etc)
* [x] 820+ unit tests
* [ ] create and publish generators (we created a handful of generators that we've been using locally, these will be published shortly)
* [ ] CLI docs (started)
* [ ] User help (e.g. when the user does `gen help` or just `gen`)
* [ ] API docs
* [ ] Generator guidelines and conventions

- [Install](#install)
- [Usage](#usage)
- [CLI](#cli)
  * [help](#help)
  * [init](#init)
  * [Run generators](#run-generators)
  * [Run tasks](#run-tasks)
  * [Run sub-generators](#run-sub-generators)
  * [Run a generator's tasks](#run-a-generator-s-tasks)
  * [Run a sub-generator's tasks](#run-a-sub-generator-s-tasks)
- [API](#api)
  * [.getConfig](#getconfig)
  * [.getTask](#gettask)
  * [.addGenerator](#addgenerator)
  * [.hasGenerator](#hasgenerator)
  * [.getGenerator](#getgenerator)
  * [.extendGenerator](#extendgenerator)
  * [.invoke](#invoke)
- [Authoring generators](#authoring-generators)
  * [Generator naming conventions](#generator-naming-conventions)
- [Related projects](#related-projects)
- [Running tests](#running-tests)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## Install

To get started, you'll first need to install `generate` globally using [npm][], along with any generators you'd like to run.

**Install generate**

Install globally with [npm](https://www.npmjs.com/)

```sh
$ npm i -g generate
```

**Install a generator**

If you aren't familiar with generate, just take the `node` generator for a test drive:

```sh
$ npm i -g generate-node
```

**Run a generator**

If everything installed correctly, you should now be able to generate a new project with the following command (make sure you run the command from an empty directory!):

```sh
$ gen node
```

***

## Usage

```sh
$ gen <command> [args]
```

## CLI

_(WIP)_

### help

_(TODO)_

Get started with Generate.

```js
$ gen help
```

### init

_(TODO)_

Get started with Generate.

```js
$ gen init
```

Upon running `init`, generate will prompt you for answers to the following questions:

### Run generators

```sh
$ gen <generator name> [options]
```

**Example**

Run generator `abc`

```sh
$ gen abc
```

### Run tasks

To run a task on the `base` generator, just pass the name of the task to run.

```sh
$ gen <task name> [options]
```

Unless overridden by the user, the `base` generator is the default generator that ships with Generate. This generator doesn't really "generate" anything, but it will prompt you for a few answers (if you choose), to store data that's commonly needed by templates, like `author.name`, GitHub `username`, etc.

**Example**

Run task `bar`:

```sh
$ gen bar
```

### Run sub-generators

> Sub-generators are normal generators that are called from (or registered by) other generators.

Dot-notation is used for getting and runing sub-generators.

```sh
$ gen <generator name>.<sub-generator name> [options]
```

**Examples**

Run sub-generator `b` on generator `a`:

```sh
$ gen a.b [options]
```

Run sub-generator `c`:

```sh
$ gen a.b.c [options]
```

And so on...

### Run a generator's tasks

```sh
$ gen <generator name>:<task name> [options]
```

**Example**

Run task `bar` on generator `foo`.

```sh
$ gen foo:bar 
```

### Run a sub-generator's tasks

```sh
$ gen <generator name>.<sub-generator name>:<task name> [options]
```

**Example**

Run task `foo` on sub.generator `a.b.c`.

```sh
$ gen a.b.c:foo 
```

## API

### [Generate](index.js#L19)

Create an instance of `Generate` with the given `options`

**Params**

* `options` **{Object}**: Configuration options to initialize with.

**Example**

```js
var Generate = require('generate');
var generate = new Generate(options);
```

### [.process](index.js#L66)

Similar to [copy](#copy) but calls a plugin `pipeline` if passed on the `config` or `options`.

**Params**

* `files` **{Object}**
* `options` **{Object}**
* `cb` **{Function}**
* `returns` **{Stream}**: Returns a [vinyl](http://github.com/gulpjs/vinyl) src stream

**Example**

```js
generate.process({src: ['a.txt', 'b.txt']}, options);
```

### [.each](index.js#L90)

Generate `files` configurations in parallel.

**Params**

* `config` **{Object}**
* `cb` **{Function}**

**Example**

```js
generate.each(files, function(err) {
  if (err) console.log(err);
});
```

### [.eachSeries](index.js#L112)

Generate `files` configurations in series.

**Params**

* `config` **{Object}**
* `cb` **{Function}**

**Example**

```js
generate.eachSeries(files, function(err) {
  if (err) console.log(err);
});
```

### [.scaffold](index.js#L144)

Generate a scaffold. See the [scaffold](https://github.com/jonschlinkert/scaffold) library for details.

**Params**

* `scaffold` **{Object}**: Scaffold configuration
* `cb` **{Function}**: Callback function

**Example**

```js
var Scaffold = require('scaffold');
var scaffold = new Scaffold({
  options: {cwd: 'source'},
  posts: {
    src: ['content/*.md']
  },
  pages: {
    src: ['templates/*.hbs']
  }
});

generate.scaffold(scaffold, function(err) {
  if (err) console.log(err);
});
```

### .getConfig

Static method for getting the very first instance to be used as the `base` instance. The first instance will either be defined by the user, like in local `node_modules`, or a globally installed module that serves as a default/fallback.

**Params**

* `filename` **{String}**: Then name of the config file to lookup.
* `returns` **{Object}**: Returns the "base" instance.

**Example**

```js
var base = Generate.getConfig('generator.js');
```

### .getTask

Get task `name` from the `generate.tasks` object.

**Params**

* `name` **{String}**
* `returns` **{Object}**

**Example**

```js
generate.getTask('abc');

// get a task from generator `foo`
generate.getTask('foo:abc');

// get a task from sub-generator `foo.bar`
generate.getTask('foo.bar:abc');
```

### .addGenerator

Alias for `register`. Adds a `generator` with the given `name` to the `generate.generators` object.

**Params**

* `name` **{String}**: The name of the config object to register
* `config` **{Object|Function}**: The config object or function

**Example**

```js
base.addGenerator('foo', function(app, base, env) {
  // `app` is a `Generate` instance created for the generator
  // `base` is a "shared" instance that provides access to all loaded generators
  // `env` is a configuration/environment object with details about the generator,
  // user cwd, etc
});
```

### .hasGenerator

Return true if generator `name` is registered. Dot-notation may be used to check for [sub-generators](#sub-generators).

**Params**

* `name` **{String}**
* `returns` **{Boolean}**

**Example**

```js
base.hasGenerator('foo.bar.baz');
```

### .getGenerator

Return generator `name` is registered. Dot-notation may be used to get [sub-generators](#sub-generators).

**Params**

* `name` **{String}**
* `returns` **{Boolean}**

**Example**

```js
base.getGenerator('foo');
// or
base.getGenerator('foo.bar.baz');
```

### .extendGenerator

Extend an generator.

**Params**

* `generator` **{Object}**
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
var foo = base.getGenerator('foo');
foo.extendGenerator(generator);
```

### .invoke

Invoke generator `fn` with the given `base` instance.

**Params**

* `fn` **{Function}**: The generator function.
* `generator` **{Object}**: The "base" instance to use with the generator.
* `returns` **{Object}**

**Example**

```js
generate.invoke(generator.fn, generator);
```

## Authoring generators

_(TODO)_

### Generator naming conventions

**Do**

Use `generate-` as the prefix, followed by any words of your choosing to describe the purpose of the generator.

**Don't**

Use `generator-` as the prefix, since the word `generator` is already associated with yeoman.

## Related projects

* [assemble-core](https://www.npmjs.com/package/assemble-core): The core assemble application with no presets or defaults. All configuration is left to the… [more](https://www.npmjs.com/package/assemble-core) | [homepage](https://github.com/assemble/assemble-core)
* [base-methods](https://www.npmjs.com/package/base-methods): Starter for creating a node.js application with a handful of common methods, like `set`, `get`,… [more](https://www.npmjs.com/package/base-methods) | [homepage](https://github.com/jonschlinkert/base-methods)
* [base-resolver](https://www.npmjs.com/package/base-resolver): 'base-methods' plugin for resolving and loading globally installed npm modules. | [homepage](https://github.com/jonschlinkert/base-resolver)
* [base-runner](https://www.npmjs.com/package/base-runner): Orchestrate multiple instances of base-methods at once. | [homepage](https://github.com/jonschlinkert/base-runner)
* [resolve-modules](https://www.npmjs.com/package/resolve-modules): Resolves local and global npm modules that match specified patterns, and returns a configuration object… [more](https://www.npmjs.com/package/resolve-modules) | [homepage](https://github.com/jonschlinkert/resolve-modules)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/generate/issues/new).

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on December 04, 2015._