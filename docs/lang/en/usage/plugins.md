---
title: Plugins
description: >
   Introduction to _generate_ plugins. How they work, how to use them, and how to author and publish your own plugins.
---

Generate has a rich and powerful plugin system. 

## What is a "project generator"?

A `generate` project generator is just a JavaScript function that:

- is registered by name using the `.register` or `.generator` methods (differences described below)
- can be locally or globally installed

**Fun fact**

Technically, a generator is just a generate plugin that can be reg

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