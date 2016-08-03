# Quick start

## Install generate

```sh
$ npm install --global generate
```

This adds the `gen` command to your system path, allowing it to be run from any directory.

## Create a generator.js file

Copy the code in the following example to `generator.js`:

```js
module.exports = function(app) {
  app.task('one', function(cb) {
    console.log('task >', this.name);
    cb();
  });

  app.task('two', function(cb) {
    console.log('task >', this.name);
    cb();
  });

  app.task('default', ['one', 'two']);
};
```

## Run the generator

Then run:

```sh
# this runs the generator's "default" task
$ gen
```

Then try:

```sh
# run the "one" task
$ gen one
# run the "two" task
$ gen two
# run the "one" and "two" tasks
$ gen one two
```

## Install a global generator

Now that you know how to run a local `generator.js` file, try installing a generator from npm:

```sh
$ npm install --global generate-example
```

## Run the global generator

Run the `example` generator:

```sh
$ gen example
```

**What will happen?**

The generator will create a file, `example.txt` in the current working directory, just to show you how generate works. That's all!