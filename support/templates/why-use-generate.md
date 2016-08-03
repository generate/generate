---
title: Why use Generate?
toc: true
---

> There are other project generators out there, why should you spend your time learning to use Generate?

## Yeoman: Slow and bloated

On one side of the spectrum, there are object-oriented, declarative solutions like Google's Yeoman, which is highly configurable, but has a steep learning curve and requires a serious time investment to create even the simplest of generators.

### Sprechen sie Yeoman?

Authoring a generator for Yeoman is not unlike learning another language. Yeoman core team members and experienced contributors might be able to nagivate the API easily, but every part of the API is verbose and filled with nuanced concepts and abstractions that are unique to Yeoman, which makes it difficult and intimidating for newcomers.

Here are some specific things we find lacking in Yeoman:

* **complicated API**: strange naming conventions and nuances unique to Yeoman create a high barrier to entry for new generator authors. This might be good for core team members or devs who created generators when yeoman was launched, since it prevents newcomers from competing with them, but it's bad in the long-term.
* **verbose generators**: Creating generators is a chore. Most popular Yeoman generators tend to be monolithic and contain huge amounts of custom code that gets re-written in generator after generator to work around limitations in Yeoman's API.
* **quasi-tasks**: Yeoman's concept of "tasks" is [Prototype methods as actions](http://yeoman.io/authoring/running-context.html). We found this to be a limiting and confusing approach.
* **no flow control**: End-users have zero control over flow aside from passing the name of a single generator on the command line and answering some prompts; and generator implementors don't get much more control than end-users. Yeoman uses a "run loop" to determine when something in your code will be executed (for example, config files are written during the `configuring` "priority", and "writing" is done during the `writing` "priority"). Although it's possible to hack around these limitations with custom code, Yeoman itself has a prescribed flow that is difficult to escape. Additionally, Yeoman's architecture limits the user to running one generator at a time, which plays a role in the tendancy for Yeoman generators be "kitchen-sinks of code".
* **poor composability**: It's not easy to combine generators. To "combine" generators the configuration-heavy `.composeWith()` method is used. To determine _how a generator is related_ to another, you need to define things like `settings.link`, which expects `weak` or `strong` as the value...? (we still don't understand this one).
* **limited templating**: [ejs](http://ejs.co/) is used for rendering templates.
* **clunky user interactions**: Prompts themselves are declarative and verbose. Every time a generator is created the same repetitive questions need to be configured again. It's not unusual to see a generator with 4 or 5 prompts taking up 50-100 lines of code. To conduct the actual prompts, Yeoman uses a "prompting queue" to get feedback from the user, and prompts are expected to be done during the `.prompting()` "priority".
* **unit tests?**: Even doing something as simple as writing unit tests is so overly-complicated with Yeoman that most authors don't bother creating any.

## Slush: Fast but limited

On the other side of the spectrum is Slush, a functional solution that is easy to learn but extremely limited in terms of composability and flow control.

### Limitations

* **Flow control**: You can only run one generator at a time
* **Composability**: Generators cannot be nested or used as plugins, so lots of commonly needed things get re-written over and over in generators.

## Generate: Best of both worlds

### Expressive API

Generate offers the robustness, power and configurability of Yeoman, with the expressiveness and simplicity of Slush.

Generate's functional, expressive API is easier to customize and more configurable than Yeoman, whilst also has an intuitive CLI and an expressive API that makes it easy to learn, and enjoyable to use.

### Low barrier to entry

If you can create a [gulp][] task, you will know how to use Generate

### Generators

**Easier to create**

Generate makes generators so easy to create and compose the

### Composability

**Easier to compose**

we encourage authors to publish [micro-generators](docs/micro-generators.md), which are generators that do one specific thing, like [generate a license file](https://github.com/generate/generate-license).

### Flow control

**Easier to control, by command line or API**

Generators and tasks.

Easy to  by command line

### User interactions

We think prompts should be less like interrogations and more like conversations. Generate makes prompts easy to create and use prompts to get user feedback at any point in a generator's lifecycle.

### Templates

**Engine**

Any node.js template engine can be used. Just do:

```js
app.engine('hbs', require('engine-handlebars'));
```

**Consolidate**

Any consolidate engine can be used (one of Generate's maintainers, @doowb, also maintains [consolidate][]).

**Assemble**

Additionally, Generate's creators have authored many popular templating libraries, including [assemble][], [handlebars-helpers][], and [templates][].

### Tools

> The Yeoman workflow comprises three types of tools ... (yo), the build tool (Gulp, Grunt etc) and the package manager (like npm and Bower).

Yeoman itself only comprises one part of the workflow: `yo`. The other two parts of the workflow happen after yeoman is out of the picture.

**Real build workflow**

Like Yeoman, Generate can be used with gulp, Grunt, NPM, Bower. But that's nothing special, any node.js library can do this. However, Generate shares common API conventions, command line options, and a plugin ecosystem with the following libraries:

- [assemble][]: build projects
- [verb][]: document projects
- [update][]: maintain projects

If you use any of these tools, you'll know how to begin using the others.
