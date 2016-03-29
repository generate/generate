# Generator composition

If you want to know how generators and sub-generators work, it might be a good idea to start with the [generators docs](generators.md).

This document describes strategies for composing generators and sub-generators so that features and functionality are shared the way you expect.

**Setup**

All of the following examples assume that we are already inside a generator like this one:

```js
module.exports = function(app) {
  // we are here!
};
```

## Why doesn't "foo" have "bar"!?

Before we dive in, it might help to review some fundamentals about how generators work. In particular, generators are _just JavaScript functions_, so they follow the same rules.

- 

```js
app.set('abc', 'xyz');
console.log(app.get('abc'));
//=> 'xyz'

app.register('foo', function(foo) {
  console.log(foo.get('abc'));
  //=> 'undefined'

  foo.register('bar', function(bar) {
    console.log(bar.get('abc'));
    //=> 'undefined'

    bar.register('baz', function(baz) {
      console.log(baz.get('abc'));
      //=> 'undefined'

    });
  });
});
```