---
draft: true
---
# Getting started

Generate and generate plugins are installed and managed via [npm](https://npmjs.org/), the [Node.js](http://nodejs.org/) package manager. Generate requires stable Node.js versions `>= 0.10.0`. Odd version numbers of Node.js are considered unstable development versions.

Before setting up generate ensure that your [npm](https://npmjs.org/) is up-to-date by running `npm update -g npm` (this might require `sudo` on certain systems).

If you've already installed generate and are now looking for a quick reference, please take a look at our [`generator.js` example](http://github.com/generate/generate/blob/master/docs/example-generator.md) and how to [configure a task](http://github.com/generate/generate/blob/master/docs/configuring-tasks.md).

## Installing generate

To get started and to take advantage of generate's command line interface (CLI), you first need to install `generate` globally. You may need to use sudo (for OSX, *nix, BSD etc) or run your command shell as Administrator (for Windows) to do this.

```shell
npm install -g generate
```

This will put the `generate` command in your system path, allowing it to be run from any directory.

## How the CLI works

Each time `generate` is run, it looks for a locally installed `generator.js` using node's `require()` system. Because of this, you can run `generate` from any subfolder in your project.

If a locally installed generate is found, the CLI loads the local installation of the generate library, applies the configuration from your `generator.js`, and executes any tasks you've requested for it to run. To really understand what is happening, [read the code](https://github.com/generate/generate/blob/master/bin/generate).

## Working with an existing generate project

Assuming that the generate CLI has been installed and that the project has already been configured with a `package.json` and a `generator.js`, it's very easy to start working with generate:

1. Change to the project's root directory.
1. Install project dependencies with `npm install`.
1. Run generate with `generate`.

That's really all there is to it. Installed generate tasks can be listed by running `generate --help` but it's usually a good idea to start with the project's documentation.

## Preparing a new generate project

A typical setup will involve adding two files to your project: `package.json` and the `generator.js`.

**package.json**: This file is used by [npm] to store metadata for projects published as npm modules.  You will list generate and the generate plugins your project needs as [devDependencies] in this file.

**generator**: This file is named `generator.js` or `generator.coffee` and is used to configure or define tasks and load generate plugins. 
**When this documentation mentions a `generator.js` it is talking about a file, which is either a `generator.js` or a `generator.coffee`**.

## package.json

The `package.json` file belongs in the root directory of your project, next to the `generator.js`, and should be committed with your project source.  Running `npm install` in the same folder as a `package.json` file will install the correct version of each dependency listed therein.

There are a few ways to create a `package.json` file for your project:

* Most [generate-init] templates will automatically create a project-specific `package.json` file.
* The [npm init] command will create a basic `package.json` file.
* Start with the example below, and expand as needed, following this [specification][json].

```js
{
  "name": "my-project-name",
  "version": "0.1.0",
  "devDependencies": {
    "generate": "~0.4.5",
    "generate-contrib-jshint": "~0.10.0",
    "generate-contrib-nodeunit": "~0.4.1",
    "generate-contrib-uglify": "~0.5.0"
  }
}
```

### Installing generate and generators

The easiest way to add generate and generators to an existing `package.json` is with the command `npm install <module> --save-dev`.  Not only will this install `<module>` locally, but it will automatically be added to the [devDependencies][] section, using a [tilde version range][].

For example, this will install the latest version of generate in your project folder, adding it to your devDependencies:

```shell
npm install generate --save-dev
```

The same can be done for generators and other node modules. As seen in the following example installing the JSHint task module:

```shell
npm install generate-contrib-jshint --save-dev
```

Checkout the current available generators to be installed and used on your project at the [plugins](http://github.com/generate/generate/blob/master/docs/plugins) page.

Be sure to commit the updated `package.json` file with your project when you're done!

## generator

The `generator.js` or `generator.coffee` file is a valid JavaScript or CoffeeScript file that belongs in the root directory of your project, next to the `package.json` file, and should be committed with your project source.

A `generator.js` is comprised of the following parts:

* The "wrapper" function
* Project and task configuration
* Loading generate plugins and tasks
* Custom tasks

### An example generator

In the following `generator.js`, project metadata is imported into the generate config from the project's `package.json` file and the [generate-contrib-uglify] plugin's `uglify` task is configured to minify a source file and generate a banner comment dynamically using that metadata. When `generate` is run on the command line, the `uglify` task will be run by default.

```js
module.exports = function(app) {

  // Project configuration.
  app.initConfig({
    pkg: app.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= app.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  app.loadNpmTasks('app-contrib-uglify');

  // Default task(s).
  app.registerTask('default', ['uglify']);

};
```

Now that you've seen the whole `generator.js`, let's look at its component parts.

### The "wrapper" function

Every `generator.js` (and generateplugin) uses this basic format, and all of your generate code must be specified inside this function:

```js
module.exports = function(app) {
  // Do generate-related things in here
};
```

### Project and task configuration

Most generate tasks rely on configuration data defined in an object passed to the [[generate.initConfig|generate#generate.initconfig]] method.

In this example, `generate.file.readJSON('package.json')` imports the JSON metadata stored in `package.json` into the generate config. Because `<% %>` template strings may reference any config properties, configuration data like filepaths and file lists may be specified this way to reduce repetition.

You may store any arbitrary data inside of the configuration object, and as long as it doesn't conflict with properties your tasks require, it will be otherwise ignored. Also, because this is JavaScript, you're not limited to JSON; you may use any valid JS here. You can even programmatically generate the configuration if necessary.

Like most tasks, the [generate-contrib-uglify] plugin's `uglify` task expects its configuration to be specified in a property of the same name. Here, the `banner` option is specified, along with a single uglify target named `build` that minifies a single source file to a single destination file.

```js
// Project configuration.
generate.initConfig({
  pkg: generate.file.readJSON('package.json'),
  uglify: {
    options: {
      banner: '/*! <%= pkg.name %> <%= generate.template.today("yyyy-mm-dd") %> */\n'
    },
    build: {
      src: 'src/<%= pkg.name %>.js',
      dest: 'build/<%= pkg.name %>.min.js'
    }
  }
});
```

### Loading generate plugins and tasks

Many commonly used tasks like [concatenation], [minification][generate-contrib-uglify] and [linting] are available as [generate plugins](https://github.com/generate). As long as a plugin is specified in `package.json` as a dependency, and has been installed via `npm install`, it may be enabled inside your `generator.js` with a simple command:

```js
// Load the plugin that provides the "uglify" task.
generate.loadNpmTasks('generate-contrib-uglify');
```

**Note:** the `generate --help` command will list all available tasks.

### Custom tasks

You can configure generate to run one or more tasks by default by defining a `default` task. In the following example, running `generate` at the command line without specifying a task will run the `uglify` task. This is functionally the same as explicitly running `generate uglify` or even `generate default`. Any number of tasks (with or without arguments) may be specified in the array.

```js
// Default task(s).
generate.registerTask('default', ['uglify']);
```

If your project requires tasks not provided by a generate plugin, you may define custom tasks right inside the `generator.js`. For example, this `generator.js` defines a completely custom `default` task that doesn't even utilize task configuration:

```js
module.exports = function(generate) {

  // A very basic default task.
  generate.registerTask('default', 'Log some stuff.', function() {
    generate.log.write('Logging some stuff...').ok();
  });

};
```

Custom project-specific tasks don't need to be defined in the `generator.js`; they may be defined in external `.js` files and loaded via the [[generate.loadTasks|generate#generate.loadtasks]] method.

## Further Reading

* The [[Installing generate]] guide has detailed information about installing specific, production or in-development, versions of generate and generate.
* The [[Configuring Tasks]] guide has an in-depth explanation on how to configure tasks, targets, options and files inside the `generator.js`, along with an explanation of templates, globbing patterns and importing external data.
* The [[Creating Tasks]] guide lists the differences between the types of generate tasks and shows a number of sample tasks and configurations.
* For more information about writing custom tasks or generate plugins, check out the [[developer documentation|generate]].

[concatenation]: https://github.com/generate/generate-contrib-concat
[devDependencies]: https://docs.npmjs.com/files/package.json#devdependencies
[generate-contrib-uglify]: http://github.com/generate/generate-contrib-uglify
[generate-init]: Project-Scaffolding
[generate.loadTasks]: https://github.com/generate/generate/wiki/generate.task
[json]: https://docs.npmjs.com/files/package.json
[linting]: https://github.com/generate/generate-contrib-jshint
[npm init]: https://docs.npmjs.com/cli/init
[npm]: https://npmjs.org/
[tilde version range]: https://npmjs.org/doc/misc/semver.html#Ranges