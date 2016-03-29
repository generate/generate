# Running tasks and generators

The generator in the following example has both a **task** with the name "project", and a **generator** named "project". 

This is completely fine; however, both the `.build` and `.generate` methods will invoke the task by default - and **not the generator**. 

After the example we'll show how to invoke the generator instead.

**Example**

Invoke the `project` task:

```js
app.register('project', function() {
  console.log('project generator');
});

app.task('project', function(cb) {
  console.log('project task');
  cb();
});

// this will run the 'project' task
app.build('project', function(err) {
  if (err) throw err;
});

// this will also run the 'project' task
app.generate('project', function(err) {
  if (err) throw err;
});
```

### Run the "project" generator

To run the "project" generator instead of the task, at least one task must be defined on the generator. 

Once that's done, we'll use the `.generate` method to accomplish our goal.

**1. using the `.generate` method**

The following code will run the `default` task on the `project` generator:

```js
app.register('project', function(project) {
  console.log('project generator');
  
  project.task('default', function(cb) {
    console.log('project generator > default task');
    cb();
  });
});

app.task('project', function(cb) {
  console.log('project task');
  cb();
});

/**
 * This will call the "default" task on the "project" generator
 */

app.generate('project', ['default'], function(err) {
  if (err) throw err;
});

/**
 * Alternatively you can use the "object-path-notation" defined by
 * [expand-object](https://github.com/jonschlinker/expand-object)
 * to call the "default" task on the "project" generator
 */

app.generate('project:default', function(err) {
  if (err) throw err;
});

/**
 * This would just call the the "project" task
 */

app.generate('project', function(err) {
  if (err) throw err;
});
```

