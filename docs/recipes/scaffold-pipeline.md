# Add plugins to a scaffold pipeline

All of the below examples below should work anywhere in generate that streams can be used and the `options.pipeline` option can be passed.

Including the following methods:

- `.scaffold`
- `.process`

**Example**

```js
app.process({
  options: {
    // function or array of plugin names or functions
    pipeline: [] 
  },
  src: '*.hbs', 
  dest: 'foo'
});
```

**Pre-register plugins**

```js
app.plugin('foo', function(opts) {
  return through.obj(function(file, enc, next) {
    next(null, file);
  });
});

// usage
options: {
  pipeline: ['foo']
}
```

**Return a function**

Return a function that returns a stream:

```js
options: {
  pipeline: generate.renderFile
}
```

**Return a stream**

```js
options: {
  pipeline: through.obj(function(file, enc, next) {
    // do stuff 
    next(null, file);
  })
}
```

**Stack multiple plugins**

Chain multiple plugins and return a stream:

```js
options: {
  pipeline: function() {
    return generate.renderFile('hbs')
      .pipe(extname())
      .pipe(rename())
  }
}
```
