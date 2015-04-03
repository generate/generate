
var relative = require('relative');
var generate = require('./');
var del = require('del');

generate.task('default', function () {
  console.log('starting...');
  generate.src('*.*')
    .pipe(generate.dest('./actual'))
    // .on('end', function (cb) {
    //   process.nextTick(function () {
    //     del('actual', cb);
    //   })
    // });
    .on('data', function (file) {
      console.log('writing...', relative(file.path));
    })
    .on('end', function () {
      console.log('done.');
    });
});

generate.run();
