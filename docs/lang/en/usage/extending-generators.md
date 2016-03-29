# Extending generators

_(WIP: this document is not complete)_

**signatures**

```js
app.use(node.plugin());
app.use(node);
app.use(function fn() {
  this.use(node);
  return fn;
});
```


Examples in this document assume the following code is defined first:

```js
var generate = require('generate');
var app = generate();
```

## .extendWith

The `.extendWith` method is used to add the features and settings from one generator to the generator calling the method.

**Example**

```js
app.register('foo', function(foo) {
  foo.abc = true;
});

app.register('bar', function(bar) {
  bar.extendWith('foo');
  console.log(bar.abc);
  //=> true
});

var bar = app.generator('bar');
console.log(bar.abc);
//=> true
```

## Advantages and disadvantages

There are a number of ways to use another generator inside your own, each has its own advantages and disadvantages. Here are a few:

- Use `.invoke` to "immediately" extend your generator
- Use `.extendWith` to "lazily" extend your generator
- Register another generator as a sub-generator of your own


We'll discuss some of these below.

1. By "invoking" it with the `.extendWith()` method inside your own generator.
2. By using the `.invoke` method exposed by {%= name %}.

**1. `.extendWith`: Lazily extend your generator**

The `.extendWith` method will extend your generator with all of the settings in the {%= name %}, including tasks. For this reason, most of the settings in {%= name %} are kept inside tasks so they can be lazyily initialized whenever it makes sense inside your own generator.

```js
app.extendWith('{%= name %}');
```

**2. `.invoke`: Immediately extend your generator**

Extend your own generator with all of the settings in this generator:

```js
app.extendWith('{%= name %}');
```

2. By using `{%= alias %}.invoke(app)` methed exposed by this generator.
