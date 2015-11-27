'use strict';

var readline = require('readline');

function confirm(msg, cb) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  msg = msg.trim() + ' ';

  rl.question(msg, function(res) {
    rl.close();
    cb(/^y|yes|ok|true$/i.test(res));
  });
}

confirm('create a new directory?', function(answer) {
  console.log(answer);
});
