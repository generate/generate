
var app = require('./');

app.task('default', function () {
  app.src('*.*')
    .pipe(app.dest('./actual'))
});

app.generate();
