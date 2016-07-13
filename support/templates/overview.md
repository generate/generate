---
title: Overview
---

**Heads up!**

Most or all of the code examples in this document assume the following code exists first:

```js
var generate = require('generate');
var app = generate();
```

## What is "Generate"?

Generate is a command line tool and developer framework for scaffolding out new GitHub projects using [plugins](#plugins), [generators](#generators) and [tasks](#tasks). Answers to prompts and the user's environment can be used to determine the templates, directories, files and contents to build. 

## Plugins

Plugins are used to add features and functionality to an instance of Generate. But you can also use plugins to "wrap" configuration settings, define [tasks](#tasks), bundle other plugins, and so on.

### Creating plugins

Plugins functions take an instance of `Generate` and are registered with the `.use` method. 

#### .use

The `.use` method immediately invokes the plugin function with the current instance of Generate. 

**Example**

```js
function plugin(app) {
  // do stuff to "app" (instance of Generate),
}
app.use(plugin);
```

**Options**

Make your plugin more flexible by wrapping it in a function, allowing options to be passed by implementors.

```js
// take options 
function plugin(options) {
  return function(app) {
    // do stuff to "app" (instance of Generate),
  }
}
app.use(plugin(/* options here */));
```

### "Smart" plugins

Generate is built on [base][] and has full support for [smart plugins][base-docs]{smart-plugins.md}. 

_(We'll just cover the basics here, visit the [base docs][base-docs] for more information.)_


#### .run

Whe plugin returns a function `.run` method takes an object


## Generators

When plugins are registered by name, we refer to them as generators. Being plugins themselves, generators can do all of the things that plugins do. But generators can also 

### Creating generators

```js
function plugin(app) {
  // do stuff to "app" (instance of Generate),
}
app.generator('foo', plugin);
```

- `.generator`: immediately invokes the plugin function with the current instance of Generate



```js
function plugin(app) {
  // do stuff to "app" (instance of Generate),
}
app.register('foo', plugin);
```

- `.register`: does not invoke the plugin function


## generator.js




## Tasks

Generators are easy to create and combine.



[base]: https://github.com/node-base/base/
[base-docs]: https://github.com/node-base/base/blob/master/docs/