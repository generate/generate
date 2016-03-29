# Prompt the user for a destination directory

**The goal**

Our goal is to great a task that initiates a user prompt, to get the user's preferred destination directory. If the `dest` directory changes on a task-by-task basis, remember to re-ask the question before each task.

**Example**

This is what our final task will look like. 

```js
app.task('ask', function(cb) {
  app.question('dest', 'Destination directory?', {default: '.'});
  app.ask('dest', {save: false}, function(err, answers) {
    if (err) return cb(err);
    app.option('dest', answers.dest);
    cb();
  });
});
```

**Tip**

If you want to store the user's response, remove `{ save: false }` from the `.ask` method options.

## Create a task

First, create a task with a name that makes sense for your project. _(It's good practice to wrap user prompts in a task, allowing them to only be called when needed.)_

```js
app.task('ask', function(cb) {
  // add prompt logic here
});
```

## Create a question

Next, use the `.question()` method to create the question to be used in the prompt.

```js
app.question('dest', 'Destination directory?', {default: '.'});
```

The `default` value was set to `.`, which is the user's current working directory. This value is used if the user does not enter a value.

## Create the prompt

Pass the name of the question (`dest`) to the `.ask` method. _(The `.ask` method takes a string or array of question names, and will be used to ask the question we created.)_

```js
app.ask('dest', {save: false}, function(err, answers) {
  if (err) return cb(err);
  app.option('dest', answers.dest);
  cb();
});
```

## All together

This is how our final task should look. Feel free to get creative and customize whatever you need for your project!

```js
app.task('ask', function(cb) {
  app.question('dest', 'Destination directory?', {default: '.'});
  app.ask('dest', {save: false}, function(err, answers) {
    if (err) return cb(err);
    app.option('dest', answers.dest);
    cb();
  });
});
```
