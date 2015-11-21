
var Resolver = require('resolve-modules');
var resolver = new Resolver({
  configPattern: 'generate.js',
  modulePattern: 'generate-*',
  configName: 'generate',
  moduleName: 'generate-next'
});


var Generate = require('..');
var generate = new Generate();



resolver.on('config', function(config) {
  var modulePath = config.modulePath || resolver.modulePath;
  var Ctor = require(modulePath);
  var fn = require(config.configPath);
  console.log(fn);
});

resolver.resolve();
