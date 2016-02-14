# generator.js example

Below we walk through a sample `generator`, but if you're looking for a quick example, this is what a basic `generator.js` file might look like:

```js
module.exports = function(app) {
  app.task('files', function(cb) {
    return app.src('templates/*', {cwd: __dirname})
      .pipe(app.renderFile('*'))
      .pipe(app.dest(app.cwd));
  });

  app.task('default', ['files']);
};
```

The entire `generator` is at the bottom of this page, but if you keep reading we'll walk through it a step at a time.

## Creating the generator

The first part is a "wrapper" function, which encapsulates your generate configuration. This function is exported and called with an instanced of `generate`. 

Thus, `app` in the example below, is an instance of `generate` created for this generator.

```js
module.exports = function(app) {
};
```

Within that function we can define any tasks to run, or add any other JavaScript code we need to create our generator application.

## Defining tasks

This is the `files` task defined in the example above. In a moment we'll add some example code to the task so you can see how tasks work. But first, if you aren't familiar with how tasks work, you might be interested in glancing at the [task docs](tasks.md) before continuing.

**example task**

Let's say you want to create a generator that will:

1. read some templates
2. render the templates
3. write the rendered files to the users's current working directory

All three steps are explained in the code comments in following example:

```js
// First, let's register a template engine to use for rendering templates.
// Engines can automatically detect files to render based on file extension,
// but in this example we want the engine to render all files regardless of
// extension, so let's register the engine as the "*" wildcard. Later in the 
// we'll use this name to force the engine to be used on all files.
app.engine('*', require('engine-base'));

app.task('files', function() {
  // the `src` method takes a glob pattern as the first argument, and options as
  // the second argument. The following pattern tells `src` to read templates 
  // with any extension, or dotfiles, from the generator's `templates/` directory
  return app.src('templates/*', {cwd: __dirname})

    // The `.renderFile()` method is used to render templates. It can automatically
    // detect the engine to use for rendering a file based on its extension, but as
    // mentioned above, we want the engine to render everything, so let's force it
    // to use the engine we defined above by passing it the engine's name, `*`:
    .pipe(app.renderFile('*'))

    // last, the `dest` method takes a directory path. in many cases this will
    // be the user's working directory, but the user can also pass a custom cwd on
    // the options. To ensure we are writing files to the directory difined by the
    // user, we'll pass `app.cwd`, a getter that ensures this value is up-to-date
    .pipe(app.dest(app.cwd));
});
```

**Default task**

Last in our example is the `default` task. Generate will look for a `default` task in your generator if no other tasks are specified at the command line. 

This is what our default task looks like in the example:

```js
// this task will run by entering "generate" in the command line
app.task('default', ['files']);
```

And here's the finished `generator`:

```js
module.exports = function(app) {
  app.task('files', function(cb) {
    return app.src('templates/*', {cwd: __dirname})
      .pipe(app.renderFile('*'))
      .pipe(app.dest(app.cwd));
  });

  app.task('default', ['files']);
};
```

_(These docs are based on the excellent [grunt docs](https://raw.githubusercontent.com/gruntjs/grunt-docs/master/Sample-Gruntfile.md))_