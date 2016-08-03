---
name: Generate
title: Middleware
description: ""
related: ['en-route']
reflinks: ['en-route']
---

## What is middleware?

A "middleware" is a function that, like [pipeline plugins](#pipeline-plugins.md), is used to transform the `file` (or `view`) object, and a callback function that represents the `next` middleware in the application’s [render cycle]().

Middleware functions can perform the following tasks:

- Execute any code.
- Make changes to the [file](docs/file.md) object.
- Call the `next` middleware function in the stack.

### Router methods and handlers

**Router methods**

Router methods in <%= upper(name) %> are similar to the methods in [express][], but instead of representing HTTP methods, they represent significant points during the render cycle.

For example, `.onLoad` represents when a [view](docs/view.md) is loaded onto a collection. Methods are described in detail in the [Router Methods](#router-methods) section.

**.handler**

Router methods are created by the `.handler` method. For example, the following would add an `.onFoo` router method to the instance:

```js
app.handler('onFoo');
```

Which would allow us to register `.onFoo` middleware, like so:

```js
app.onFoo(/./, function(file, next) {
  // do stuff to `file`
  next();
});
```

**.handle**

The `.handle` method is usd to actually execute all of the middleware functions that were registered using the `.onFoo` method. 

For example:

```js
// pass a vinyl `file` object as the second argument
app.handle('onFoo', file, function(err, file) {
  if (err) return console.log(err);
  // "file" is transformed by any `onFoo middleware that matched `file.path`
});
```

## Comparison to pipeline plugins

**Middleware**

- Are run by [handlers][], which are called at specific points during the [render cycle](docs/render-cycle.md)
- Don't return anything

**Pipeline plugins**

- Return a stream
- Push files into the stream

## Middleware events

Events are automatically created for corresponding route methods. For example, a `.load` event is created for the `.onLoad` route method.

**Example**

```js
app.on('load', function(view) {
  console.log(view);
});

app.onLoad(/./, function(view, next) {
  console.log(view);
  next()
});

app.pages('foo', {content: 'this is content'});
```

## Built-in handlers

The following middleware handlers are built-in to {%= upper(name) %}, in order:

* [onLoad](#onLoad): Immediately after a view is loaded, as a last step just before adding the view to a collection.
* [preRender](#preRender): Called before rendering a view.
* [preCompile](#preCompile): Called before compiling a view.
* [preLayout](#preLayout): Immediately before the first [layout][] in a [layout-stack][] is applied to a view.
* [onLayout](#onLayout): Called after each [layout][] in a [layout-stack][] is applied.
* [postLayout](#postLayout): Called after all [layouts][] have been applied to a view.
* [onMerge](#onMerge): Called directly before [partials][] collections are merged onto the [context][].
* [postCompile](#postCompile): Called after compiling a view.
* [postRender](#postRender): Called after rendering a view.

Note that if `.compile` is called directly, the `.preCompile` middleware handler will be called before `.preRender`.

### Pipeline handlers

<%= upper(name) %> adds the following handlers via the [assemble-fs][] plugin:

- `onStream`: called by the `.toStream` method upon adding a view to the `.src` stream
- `preWrite`: called by the `.dest` method before writing `view.contents` to the file system
- `postWrite`: called by the `.dest` method after writing `view.contents` to the file system

### Custom handlers


## Middleware methods

### onLoad

Immediately after a view is loaded, as a last step just before adding the view to a collection.

**Example**

Parse [YAML Front Matter][yaml] and add the parsed data object to `view.data`:

```js
var matter = require('parser-front-matter');
app.onLoad(/\.hbs$/, function(view, next) {
  matter.parse(view, next);
});
```

### preRender

Called before rendering a view.

```js
app.preRender(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### preCompile

Called before compiling a view.

```js
app.preCompile(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### preLayout

Immediately before the first [layout][] in a [layout-stack][] is applied to a view.

```js
app.preLayout(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### onLayout

Called after each [layout][] in a [layout-stack][] is applied.

```js
app.onLayout(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### postLayout

Called after all [layouts][] have been applied to a view.

```js
app.postLayout(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### onMerge

Called directly before [partials][] collections are merged onto the [context][].

```js
app.onMerge(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### postCompile

Called after compiling a view.

```js
app.postCompile(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### postRender

Called after rendering a view.

```js
app.postRender(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```


[yaml]: https://en.wikipedia.org/wiki/YAML
