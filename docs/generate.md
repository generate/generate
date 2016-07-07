# Generate

## What is Generate?

Generate is a command line tool and developer framework for scaffolding out new GitHub projects. Similar to Yeoman, but with a functional and expressive API that is more powerful, easier to learn, and provides [unmatched flow control](#unmatched-flow-control) using a unique combination of generators, sub-generators and gulp-style tasks.

### Unmatched flow control

Generators are easy to create and run with generate.

## Getting started

**Install generate**

Install generate with:

```sh
$ npm install generate
```

**Require**

Once generate is installed locally, your can use it in your application using node.js `require()` system:

```js
var generate = require('generate');
// and create an instance of generate
var app = generate();
```

### Register a generator

The `.register` method is used for caching generators on the `app.generators` object.

**Example**

Register generator `foo`:

```js
app.register('foo', function(app) {
  console.log(app);
});
```

Generator `foo` can now be found at `app.generators.foo`.

### Get a generator

Get generator `foo` from `app.generators`:

```js
var foo = app.getGenerator('foo');
```

Visit the [generator API docs](api/generator.md) for more details.

### Run a generator

Execute any code inside generator `foo`:

```js
app.generate('foo', function(err) {
  // "err" is either an error object or undefined
});
```

### generator.js

When used by command line, Generate's CLI will register a `generator.js` file as the `default` generator for you.

**create generator.js**

Export a function from a local `generator.js` file:

```js
// -- generator.js --
module.exports = function(app) {
  // do generator stuff
  console.log(app);
};
```

**Run generator.js**

From the command line, run:

```sh
gen
```

### Create sub-generators

```js
// -- generator.js --
module.exports = function(app) {
  // do generator stuff
  console.log(app);
};
```

### Run installed generators

Generators can be locally or globally installed. To install the example generator:

```sh
$ npm install --global generate-example
```

Then run it with the following command:

```sh
$ gen example
```

### Run multiple generators

Multiple generators can be run at the same time, using the command line or API.

are so easy to compose and combine that ideal for creating and publishing single-responsibility "micro-generators" Support for gulp, assemble and Base plugins.

Generate is a command line tool and developer framework for scaffolding out new GitHub projects. Generators are easy to create and combine. Answers to prompts and the user's environment can be used to determine the templates, directories, files and contents to build. Support for gulp, assemble and Base plugins.
