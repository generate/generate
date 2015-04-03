
var generate = require('./');

generate.task('default', function () {
  generate.src('*.*').pipe(generate.dest('./actual'))
});

generate.run();
