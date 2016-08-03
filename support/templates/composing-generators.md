---
title: Composing generators
related: 
  doc: ['generators', 'installing-generators', 'micro-generators']
---

The [introduction to generators](generators.md) teaches you how to create, register and run generators. 
The document expands on the introduction by reviewing strategies for composing generators, with the ultimate goal of creating a better user experience and keeping complexity to a minimum in your generators.

## Composition

**Simple is usually better**

When thinking about the ideal flow for your Generate generator, it's good practice to look for the simplest way to accomplish what you need. Although Generate offers a great deal of flexibility when it comes to composing generators, simple is usually better. Users will thank you for it (and you will thank yourself the next time you need to update your generator).

**Empower the user**

For example, Let's say you create a ["micro-generator"](#micro-generators) named `generate-foofile`, which, as all good micro-generators do, only does one thing: it generates a `foofile.js` to the current working directory. 

After using `generate-foofile` a few times, you decide that the destination directory should be customizable. There are a number of ways to accomplish this, but you narrow down your choices to one of the following:

1. use [generate-dest][] as a [plugin](api/plugins.md), and setup a `dest` task, so that when users run `$ gen foofile`, they are automatically prompted for a destination directory before generating the file. Or,
1. you can add the following sentence to the readme for `generate-foofile`: "To customize the destination directory, install [generate-dest][] globally and run it before running this generator. Example: `$ gen dest foofile`".

There is no correct answer, but more often than not the second option will be the better choice, since it:

- empowers the user to choose whether or not they want to be prompted, and 
- it keeps code debt to a minimum in your own generator

**Create for you**

When you create a generator, you are creating an experience. Until such time as your generator is published and you begin getting feedback from other users, the most important judge of that experience, the only judge of that experience, is you. 

If you are unhappy with the experience, it's a safe bet that others will be too. For that reason, the focus of this document is to help you create a better user experience _for you_. If we accomplish that goal, the rest will take care of itself.

**Code-centric**

Code-wise, composing a Generate generator is much like composing any other library. You can hand-code everything from scratch with vanilla JavaScript, you can leverage existing packages on [npm](https://www.npmjs.com), or - like building blocks - you can use other Generate [plugins](api/plugins.md) and [generators](docs/generators.md) to create a completely custom experience within your own generator. 

**User-centric**

But you're not constricted to using code to solve problems with Generate. Generate's CLI has a few building blocks of its own. 

TBC...

TODO

- [] using macros
- [] chaining generators in the command line

### Command line

TODO

```sh
$ gen foo bar baz
```

### Plugins

TODO

```js
module.exports = function(app, base) {
  app.use(require('generate-collections'));
};
```


### Micro-generators

TODO


```js
module.exports = function(app, base) {
  app.use(require('generate-collections'));
};
```


### Sub-generators

TODO


```js
module.exports = function(app, base) {
  this.register('foo', function() {
    this.task('default', function(cb) {
      console.log('done!');
      cb();
    });

    this.register('bar', function() {
      this.register('baz', function() {
        this.task('default', function(cb) {
          console.log('done!');
          cb();
        });
      });
    });
  });

  // run sub-generators programatically (we wrap the call 
  // to `.generate` in a task to defer execution of the 
  // generator until the task is run)
  app.task('default', function(cb) {
    app.generate('foo.bar.baz', cb);
  });
};
```

Or, from the command line:

```sh
# run the `default` task on gen-generator `foo`
$ gen foo
# or
$ gen foo:default
# invoke sub-generator `foo.bar`
$ gen foo.bar
# run the `default` task sub-generator `foo.bar.baz`
$ gen foo.bar.baz
# or 
$ gen foo.bar.baz:default
```

### Combining generators

TODO


```js
module.exports = function(app, base) {
  app.use(require('generate-defaults'));
  app.use(require('generate-collections'));
  app.use(require('generate-editorconfig'));
  app.use(require('generate-license'));
  app.use(require('generate-package'));
  app.use(require('generate-eslint'));
  app.task('default', Object.keys(app.tasks));
};
```
