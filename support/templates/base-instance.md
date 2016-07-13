---
title: The "base" instance
---

All applications built with [base][base] have a special `base` property, with a special purpose.

**Example**

```js
var App = require('base');
var app = new App();

console.log(app.base);
```

## How does it work?

The `app.base` property is a getter/setter that allows instances to be nested to any depth, whilst always exposing the _very first ancestor instance_, on every instance, on the `app.base` property. This will make more sense in a moment.

**app.parent**

However, this only works when every "child" instance in the "inheritance tree" keeps a reference to its "parent" instance using the `app.parent` property.

When `app.parent` is undefined, the instance itself (or `app`) is returned by the getter.

### Example

**without `.parent`**

To demonstrate how this works, we'll create a few instances of [base][], each with a `val` property that is assigned a different value, and _no `.parent` property_.

```js
var App = require('base');

// the first instance
var a = new App();
a.val = 'aaa';

var b = new App();
b.val = 'bbb';

var c = new App();
c.val = 'ccc';

console.log(a.base);
console.log(b.base);
console.log(c.base);
//=> Base { options: {}, cache: {}, val: 'aaa' }
//=> Base { options: {}, cache: {}, val: 'bbb' }
//=> Base { options: {}, cache: {}, val: 'ccc' }
```

All instances return "themselves", since `.parent` was not defined.

**with `.parent`**

This time we'll create the same instances of [base][], each with a `val` property that is assigned a different value, but we _will add a `.parent` property_ to each "child".

```js
var App = require('base');

// the first instance
var a = new App();
a.val = 'aaa';

var b = new App();
b.val = 'bbb';
b.parent = a; // <= parent

var c = new App();
c.val = 'ccc';
c.parent = b;  // <= parent

console.log(a.base);
console.log(b.base);
console.log(c.base);
//=> Base { options: {}, cache: {}, val: 'aaa' }
//=> Base { options: {}, cache: {}, val: 'aaa' }
//=> Base { options: {}, cache: {}, val: 'aaa' }
```

Now that `.parent` is defined, **all three instances** log out `aaa` as the value of `val`. This is because the `app.base` getter kept a reference to the first instance in the "tree", which was `a`.

## Use cases

We use this property in applications like [generate][], [update][] and [assemble][] for caching instances, but it will be easier to see how we use it by creating a new application with fewer moving parts.

### Example app

**1. Create an application**

Our example application will be used for getting and setting "tasks" on the `app.tasks` object:

```js
var Base = require('base');
function Foo() {
  Base.call(this);
  this.tasks = {};
}
Base.extend(Foo);
```

**2. Add a "task" method**

Let's add a method for getting and setting tasks:

```js
Foo.prototype.task = function(key, task) {
  if (typeof task === 'undefined') {
    return this.tasks[key];
  }
  this.tasks[key] = task;
  return this;
};
```

Use it like this:

```js
var app = new Foo();
app.task('foo', function() {});
console.log(app.task('foo')); //=> [function]
```

**3. Add a "create" method**

We can make this more interesting by adding a method for caching instances of `Foo`.

```js
var Base = require('base');

function Foo() {
  Base.call(this);
  this.tasks = {};
  // add an object for caching "apps"
  this.apps = {};
}
Base.extend(Foo);

Foo.prototype.app = function(key, fn) {
  if (typeof fn === 'undefined') {
    var obj = this.apps[key];
    var app = new Foo();
    app.parent = obj.parent;
    obj.fn(app);
    return app;
  }
  this.apps[key] = {
    name: key,
    fn: fn,
    parent: this
  };
  return this;
};
```

and use it like this:

```js
var app = new Foo();
app.app('foo', function() {});
console.log(app.task('foo')); //=> [function]
```

TBC
