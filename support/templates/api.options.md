---
title: Options
---

API documentation for setting and getting options.

## .options

Options are stored on the `app.options` object. You can set or get directly from this object, or use the [.option](#option) method.

## .option

Set or get an option, or object of options.

```js
// set an option
app.option('foo', 'bar');

// get an option
console.log(app.option('foo')); //=> 'bar'

