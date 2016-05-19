---
title: Questions API
---
# Questions API

Generate offers a powerful "Questions API" that makes it easy to create user prompts. In particular, the [.question]() and

 that exposes all of the methods from [question-store][] and [question-cache][], along with a special asynchronous ["ask" helper][]

## Methods

The following methods are available for 

- [.question](#question)
- [.ask](#ask)
- [.confirm](#confirm)
- [.choices](#choices)

Generate's Questions API is powered by the following libraries, please visit these projects to see all available features and options. some methods, and a special [ask helper](#ask-helper) for handling user prompts in generators.

- [base-questions][]
- [question-store][]
- [question-cache][]

## .confirm

Create a `confirm` question.

**Params**

* `name` **{String}**: Question name
* `msg` **{String}**: Question message
* `queue` **{String|Array}**: Name or array of question names.
* `options` **{Object|Function}**: Question options or callback function
* `callback` **{Function}**: callback function

**Example**

```js
app.confirm('file', 'Want to generate a file?');

// equivalent to
app.question({
  name: 'file',
  message: 'Want to generate a file?',
  type: 'confirm'
});
```

## .choices

Create a "choices" question from an array.

**Params**

* `name` **{String}**: Question name
* `msg` **{String}**: Question message
* `choices` **{Array}**: Choice items
* `queue` **{String|Array}**: Name or array of question names.
* `options` **{Object|Function}**: Question options or callback function
* `callback` **{Function}**: callback function

**Example**

```js
app.choices('color', 'Favorite color?', ['blue', 'orange', 'green']);

// or
app.choices('color', {
  message: 'Favorite color?',
  choices: ['blue', 'orange', 'green']
});

// or
app.choices({
  name: 'color',
  message: 'Favorite color?',
  choices: ['blue', 'orange', 'green']
});
```

## .question

Add a question to be asked by the `.ask` method.

**Params**

* `name` **{String}**: Question name
* `msg` **{String}**: Question message
* `value` **{Object|String}**: Question object, message (string), or options object.
* `locale` **{String}**: Optionally pass the locale to use, otherwise the default locale is used.
* `returns` **{Object}**: Returns the `this.questions` object, for chaining

**Example**

```js
app.question('beverage', 'What is your favorite beverage?');

// or
app.question('beverage', {
  type: 'input',
  message: 'What is your favorite beverage?'
});

// or
app.question({
  name: 'beverage'
  type: 'input',
  message: 'What is your favorite beverage?'
});
```

## .ask

Ask one or more questions, with the given `options` and callback.

**Params**

* `queue` **{String|Array}**: Name or array of question names.
* `options` **{Object|Function}**: Question options or callback function
* `callback` **{Function}**: callback function

**Example**

```js
// ask all questions
app.ask(function(err, answers) {
  console.log(answers);
});

// ask the specified questions
app.ask(['name', 'description'], function(err, answers) {
  console.log(answers);
});
```

## ask helper

The `ask` helper is asynchronous and is used in templates to prompt the user for answers to questions. These answers are then passed to any registered template engines as context at render time.

**Example**

![ask helper example](http://g.recordit.co/HTYoyN2JD1.gif)

**Example with conflict detection**

![ask-helper-conflicts](https://cloud.githubusercontent.com/assets/383994/15089173/f8217112-13cb-11e6-9b8a-f29daa413b45.gif)
