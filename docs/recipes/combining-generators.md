
```js
module.exports = function(generate, base, env) {
  base.compose(generate, ['foo', 'bar', 'baz']);

  generate.task('abc', function(cb) {
    generate.build(['a', 'baz_b', 'bar_a', 'c'], cb);
  });

  generate.task('foo', function(cb) {
    base.build('foo', cb);
  });

  generate.task('bar', function(cb) {
    base.build('bar', cb);
  });

  generate.task('baz', function(cb) {
    base.build('baz', cb);
  });

  generate.task('default', ['foo', 'bar', 'baz']);
};
```
