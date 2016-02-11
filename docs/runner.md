

```js
#!/usr/bin/env node

var generate = require('generate');
var run = generate.runner('foofile.js', require('./foo'));
var app = generate();

// generate stuff
run(app, function(err, argv, app) {
  // err - generator errors
  // argv - processed by minimist and expand-args
  // app instance with generators and tasks loaded (same
  // app that was passed in, exposed as a convenience)
});
```