# FAQ
## CLI
### Why do commands need to prefixed with dashes?
Generate takes an object from `process.argv` and passes it to [yargs-parser][] to be parsed. For example, if `$ gen foo bar --one --two=three` was passed to `yargsParser()`, the result would be an object that looks something like this.

```js
{
  _: ['foo', 'bar'],
  one: true,
  two: 'three'
}
```

Generate assumes that the array arguments on the `_` property (`foo` and `bar`) are intended to be used for running tasks and generators. This is the same convention followed by projects like [gulp][] and [Grunt]() for running tasks.

This allows generate (and generator authors) to safely use any other non-array arguments as options.

### Is it possible to render a single file without a config file or generator?**
Yes, just use the `render` command, which runs a [task in the built-in generaor](lib/generator.js) for rendering files. (this can be overridden by a custom render task)