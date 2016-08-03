# Usage

The following intro only skims the surface of what generate has to offer. For a more in-depth introduction, we highly recommend visiting the [getting started guide][getting-started].

<a name="generators"></a>

**Create a generator**

Add a `generator.js` to the current working directory with the following code:

```js
module.exports = function(app) {
  console.log('success!');
};
```

**Run a generator**

Enter the following command:

```sh
gen
```

If successful, you should see `success!` in the terminal.

<a name="tasks"></a>

**Create a task**

Now, add a task to your generator.

```js
module.exports = function(app) {
  app.task('default', function(cb) {
    console.log('success!');
    cb();
  });
};
```

Now, in the command line, run:

```sh
$ gen
# then try
$ gen default
```

When a local `generator.js` exists, the `gen` command is aliased to automatically run the `default` task if one exists. But you can also run the task with `gen default`.

**Run a task**

Let's try adding more tasks to your generator:

```js
module.exports = function(app) {
  app.task('default', function(cb) {
    console.log('default > success!');
    cb();
  });

  app.task('foo', function(cb) {
    console.log('foo > success!');
    cb();
  });

  app.task('bar', function(cb) {
    console.log('bar > success!');
    cb();
  });
};
```

Now, in the command line, run:

```sh
$ gen
# then try
$ gen foo
# then try
$ gen foo bar
```

**Run task dependencies**

Now update your code to the following:

```js
module.exports = function(app) {
  app.task('default', ['foo', 'bar']);

  app.task('foo', function(cb) {
    console.log('foo > success!');
    cb();
  });

  app.task('bar', function(cb) {
    console.log('bar > success!');
    cb();
  });
};
```

And run:

```sh
$ gen
```

You're now a master at running tasks with generate! You can do anything with generate tasks that you can do with [gulp](http://gulpjs.com) tasks (we use and support gulp libraries after all!).

**Next steps**

But generate does much more than this. For a more in-depth introduction, we highly recommend visiting the [getting started guide][getting-started].