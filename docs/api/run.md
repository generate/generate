# run

**Heads up!**

Most or all of the code examples in this document assume the following code exists first:

```js
var generate = require('generate');
var app = generate();
```

**Prerequisites**

If you're not familiar with how plugins work, it might help to review that documentation first:

* [plugins](api/plugins.md)
* [smart-plugins](docs/smart-plugins.md)

## .run

The `.run` method is used for running the functions stored on the `.fns` array.

**How do functions get on the `.fns` array?**

When a [plugin](docs/smart-plugins.md) returns a function, the returned function is pushed onto the `.fns` array.

**What happens when `.run` calls a function?**

## Examples

### 1. Normal plugin

The following plugin does _not_ return a function. Once it's called it will not be heard from again.

```js
console.log(app.fns);
//=> []

function plugin() {
  // do plugin stuff
}

app.use(plugin);
console.log(app.fns);
//=> []
```

### 2. Smart plugin

The following plugin returns a function, `foo`, which will be pushed onto the `.fns` array:

```js
console.log(app.fns);
//=> []

function plugin() {
  // do plugin stuff
  return function foo(obj) {
    // do stuff to `obj`
  };
}

app.use(plugin);
console.log(app.fns);
//=> ['[function foo]']
```

## Usage

When `.run` is called, it iterates over the `.fns` array and calls each function in the array on the given `obj`.

**Example**

```js
var obj = {};
app.run(obj);
```
