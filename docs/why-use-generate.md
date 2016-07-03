# Why use Generate?

> There are other project generators out there, why should you spend your time learning to use Generate?

## Slow and bloated

On one side of the spectrum, there are object-oriented, declarative solutions like Google's Yeoman, which is highly configurable, but has a steep learning curve and requires a serious time investment to create even the simplest of generators.

### Sprechen sie Yeoman?

Authoring a generator for Yeoman is not unlike learning another language. Yeoman core team members and experienced contributors might be able to nagivate the API easiliy, but every part of the API is verbose and filled with nuanced concepts and abstractions that are unique to Yeoman, which makes it difficult and intimidating for newcomers.

To be more specific, here are just a few of the things we find lacking in Yeoman:

* **tasks**: Yeoman's concept of "tasks" is [Prototype methods as actions](http://yeoman.io/authoring/running-context.html). We found this to be a limiting and confusing approach.
* **flow control**: Generator implementors and end-users have very little control over flow. Yeoman uses a "run loop" to determine when something in your code will be executed (for example, config files are written during the `configuring` "priority"). Although these methods can be augmented with custom code by implementors, Yeoman itself has a prescribed flow that is difficult to work around. Additionally, Yeoman's architecture limits the user to running one generator at a time, which plays a role in the tendancy for generators be kitchen-sinks of code.
* **composability**: It's not easy to combine generators. To "combine" generators the configuration-heavy `.composeWith()` method is used. To determine _how a generator is related_ to another, you need to define things like `settings.link`, which expects `weak` or `strong` as the value...? (we still don't understand this one).
* **templates**: Limited to ejs.
* **user interactions**: Yeoman uses a "prompting queue" to get feedback from the user, and prompts should be done during the `.prompting()` "priority".
* **generators**: Most popular generators tend to be monolithic and contain huge amounts of custom code to work around Yeoman's API, instead of working _with it_. This is hardly suprising Given Yeoman's limitations, and clunky architecture.
* **unit tests**: Even doing something as simple as writing unit tests is so overly-complicated with Yeoman that most authors don't bother creating any.

## Fast and limited

On the other side of the spectrum is Slush, a functional solution that is easy to learn but extremely limited in terms of composability and flow control.

## Project generators done right

* Low barrier to entry. If you can create a [gulp][] task, you will know how to use Generate

### Generators

**Easier to create**

Generate makes generators so easy to create and compose the we encourage authors to publish [micro-generators](docs/micro-generators.md), which are generators that do one specific thing, like [generate a ](https://github.com/generate/generate-license)`LICENSE` file.

### Composability

**Easier to compose**

### Flow control

**Easier to control, by command line or API**

Generators and tasks.

Easy to  by command line

### Prompts

We think prompts should be less like interrogations and more like conversations. Generate makes prompts easy to create and use prompts to get user feedback at any point in a generator's lifecycle.

Generate is easier to customize and more configurable than Yeoman, but it also has an intuitive CLI and an expressive API that makes it easy to learn, and enjoyable to use.

### Templates

**Engine**

Any node.js template engine can be used. Just do:

```js
app.engine('hbs', require('engine-handlebars'));
```

**Consolidate**

Any consolidate engine can be used (one of Generate's maintainers, @doowb, also maintains [consolidate][]).

**Assemble**

Additionally, Generate's creators have authored many popular templating libraries, including [assemble][], [handlebars-helpers][], and [templates][]

### Tools

> The Yeoman workflow comprises three types of tools ... (yo), the build tool (Gulp, Grunt etc) and the package manager (like npm and Bower).

Generate's advantage is that it's intuitive, easy to learn, easy to use, and easy to create generators. Generate "micro-generators" can easily be combined to create more sophisticated generators.
