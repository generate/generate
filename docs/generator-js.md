---
title: generatefile.js
related:
  doc: ['generators', 'sub-generators', 'installing-generators', 'micro-generators']
---

Each time `generate` is run, Generate's CLI looks for an `generator.js` in the current working directory.

**If `generator.js` exists**

Generate's CLI attempts to:

1. Load a local installation of the Generate library using node's `require()` system, falling back to a global installation if not found locally.
1. Load the configuration from `generator.js` using node.js `require()` system
1. Register the configuration as the ["default" generator](generators.md#default-generator)
1. Execute any tasks or generators you've specified for it to run.
1. If multiple task or generator names are specified on the command line, Generate's CLI will attempt to run

**If `generator.js` does not exist**

Generate's CLI attempts to find any generators you've specified for it to run, using node's `require()` system to search for locally and globally installed modules with the name `generator-*`.

## Creating a generator.js

An `generator.js` may contain any custom JavaScript code, but must export a function that takes an instance of Generate (`app`):

**Example**

```js
// -- generator.js --
module.exports = function(app) {
  // custom code here
};
```

Inside this function, you can define [tasks](tasks.md), additional [generators](generators.md), or any other custom JavaScript code necessary for your generator:

```js
module.exports = function(app) {
  // register a task
  app.task('default', function(cb) {
    // do task stuff
    cb();
  });

  // register a generator
  app.register('foo', function() {

  });

  // register another generator
  app.register('bar', function() {

  });
};
```

## Related

**Docs**

* [installing-generators](installing-generators.md)
* [generators](generators.md)
* [tasks](tasks.md)

[base-plugins]: https://github.com/node-base/base-plugins
[gulp]: http://gulpjs.com
[generate-dest]: https://github.com/generate/generate-dest
[assemble]: https://github.com/assemble/assemble
[templates]: https://github.com/jonschlinkert/templates
[update]: https://github.com/update/update
[verb]: https://github.com/verbose/verb
[base]: https://github.com/node-base/base
[assemble-core]: https://github.com/assemble/assemble-core
[handlebars]: http://www.handlebarsjs.com/
[lodash]: https://lodash.com/
[swig]: https://github.com/paularmstrong/swig
[pug]: http://jade-lang.com
[consolidate]: https://github.com/visionmedia/consolidate.js
[vinyl]: http://github.com/wearefractal/vinyl
[generator]: https://github.com/thisandagain/generator
[getting-started]: https://github.com/taunus/getting-started
[gray-matter]: https://github.com/jonschlinkert/gray-matter
