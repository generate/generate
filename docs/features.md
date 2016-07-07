# Features

## What can generate do?

Here are just a few of the features that make generate awesome:

* If you know how to use [assemble][], [templates][], [update][], [verb][] or any other [base][] application, you will know how to use generate. The same holds true in reverse.
* Built on [assemble-core][], so all methods from [base][], [assemble][], and [templates][] are exposed on generate's API.
* Supports [gulp][] and [assemble][] plugins
* **tasks**: Runs tasks from any generator or sub-generator, programmatically or via CLI. Tasks are powered by some of the same underlying libraries as [gulp][], so if you're familiar with gulp you will know how to create and use tasks with generate
* **templates**: generate a single file or an entire project using templates
* **collections**: first class support for template collections, including pagination, sorting, groups, and more.
* **scaffolds and boilerplates**: initialize an entire project, or provide ad-hoc "components" throughout the duration of a project using any combination of [templates, scaffolds and boilerplates](#templates-scaffolds-and-boilerplates).
* **any engine**: use any template engine to render templates, including [handlebars][], [lodash][], [swig][] and [pug][], and anything supported by [consolidate][]
* **middleware**: Use middleware for transforming files at any point in the [render cycle](render-cycle.md), such as `onLoad`, `preRender`, `postRender`, etc.
* Supports middleware that can be run on specific files or template collections, at specific points during the _build cycle_

* **data**: gathers data from the user's environment to populate "hints" in user prompts and render templates
* **file system**: methods for interacting with the file system
* **vinyl**: files and templates are [vinyl][] files
* **streams**: full support for [gulp][] and [assemble][] plugins
* **plugins**: It's easy to add functionality and features to generate using via plugins.
* **plugin ecosystem**: Generate is built on [base][], so any plugin from the Base ecosystem can be used, including plugins from [assemble][], [update][], [verb][] and [base][] itself.
* **config stores**: persist configuration settings, global defaults, project-specific defaults, answers to prompts, and so on.
* **Easy to test**: testing generators is easy, no special setup or helpers required.
* **Well-tested**: Generate itself is well-tested, with more than 1,200 unit tests.

### Generators

* Generators can extend and use other generators
* **generators**: generators are lazy, so (unless forced) generators are only invoked when they're actually used
* **global generators**: runs globally-installed generators
* **local generators**: runs locally-installed generators
* **generator.js**: use a local `generator.js` for generating project-specific files or scaffolds.
* **sub-generators**: Runs sub-generators using simple dot-notation. Supports any level of nesting!

### User interaction

* **prompts**: interact with the user, easily create custom prompts to get any data you need. Answers to prompts can be used as context for rendering templates, settings options, determining file names, directory structure, and anything else that requires user feedback.
* **conflict detection**: prompts the user for feedback before overwriting existing files
* **patient prompts**: ever started generating a project and had to start over? No problem! generate saves project-specific answers as "hints", allowing you to start over where you left off.
* **`ask` helper**: it couldn't be easier to create prompts for data to be used in templates. Just do `<%= ask("name") %>` instead of `<%= name %>`. See the ["ask" helper docs](docs/ask-helper.md) for more details.
* **`askInclude` helper**:
* **install vendor libraries**:  optionally install dependencies, which are automatically detected based on files generated

These are just a few of the features that make generate a powerful and fun to use.

## Why use generate, instead of X?

* **chainable**: generators can be chained in the command line or via API. For example, you can install [generate-dest][] then run `$ gen dest` followed by the name of another generator. `generate-dest` will prompt you for the destination directory and store the so the next generator can optionally use it. Or you can extend your own generator with the features and functionality of [generate-dest][].
* **Highly pluggable**: generators can be extended with plugins, other generators, or even sub-generators.
* **composable**: generators can be created from one or more other generators.
* **unparalleled flow control**: by leveraging Generate's unique combination of [generators](docs/generators.md) and [tasks](docs/tasks.md)
* **continuity**: Generators, sub-generators and tasks can be run by command line, API, or both, with a seamless experience between the two.
* **developer friendly API**: generate's API was designed from the ground up with developers in mind. Visit the [getting started guide][getting-started], and within 5 minutes you'll know enough to start using generate.
* **Intuitive CLI**:
* **leverage existing modules**: generators are easy to create, share and publish. Use any javascript or npm package in your generators or plugins. Implementors can use any npm package, and write plugins in pure JavaScript.

## What can I do with generate?

* **init complete projects**: automate the creation of entire projects using answers to prompts, stored defaults and environmental variables to determine directory structure, files and contents.
* **generate a single file**: generate a single file, or pick the files you want to generate.
* Rapidly create a new project
* Generate a single file from a template
* Create new sections of a project, like a new controller with unit tests
* Create modules or packages
* Bootstrapping new services
* Enforcing standards, best practices and style guides
* Promote new projects by letting users get started with a sample app

## Core concepts

TODO: explain why each is valuable

* Generators: run "generators", which can be thought of as _containers for tasks_. Run a generator using the
* Sub-generators: any generator can _run or be_ a sub-generator.
* Tasks: run [gulp][]-style tasks from command line or API

## Who should use generate?

* implementors: use generate as a node.js library as a part of your own application
* programmers: create and publish generators and plugins
* designers: generate files (or templates) from templates, scaffolds or boilerplates. Automate the creation of CSS and HTML files, or web components.

### What can generate do?

**Ultimate flow control**

Generate's powerful and expressive API gives you the flow control you've always wanted. In a [matter of minutes](https://github.com/generate/getting-started) you can learn generate's API well enough to author a fully functional [generator][].

**Generate single files, or entire projects**

Generate can use past history and preferences to generate a file without asking a single question, or automate the creation of entire new projects, with dotfiles and vendor libraries included.

Directory structure can be based on current environment and answers to questions, where the exact files and contents created depend on the template chosen along with the answers to the questions asked.

See [how generate compares to yeoman](#comparison-to-yeoman).

Visit the [getting started guide][getting-started] to learn more.

* [How does generate work?](#How does generate work?)
* [Why should I use generate (instead of X)?](#why-use-generate)

## How does it work?

For a detailed introduction, we recommend visiting Generate's [Getting Started Guide](#Getting Started Guide). Here are the core concepts:

* * Generate is installed globally using npm, which adds the `gen` command to your system path
* Once installed, generate's CLI is used to find and run generators

Generate's API and CLI

* API: Generate itself provides methods for [creating](#creating-generators) and [running](#running-generators) [generators](#generators) and [tasks](#tasks)
* generators: Generators do the "real work".
* plugins
* command line: Generate's CLI focused on [finding](#resolving) locally or globally installed generators

**CLI**

Designed from the ground up to help developers be more productive, Generate is easy to learn, easy to use, and easy to hack on.

## Related

**Docs**

* [faq](faq.md)

[base-plugins]: https://github.com/node-base/base-plugins
[gulp]: http://gulpjs.com
[generate-dest]: https://github.com/generate/generate-dest
[assemble]: https://github.com/assemble/assemble
[templates]: https://github.com/jonschlinkert/templates
[update]: https://github.com/update/update
[verb]: https://github.com/verbose/verb
[base]: https://github.com/node-base/base
[assemble-core]: https://github.com/assemble/assemble-core
[handlebars]: http://www.handlebarsjs.com/
[lodash]: https://lodash.com/
[swig]: https://github.com/paularmstrong/swig
[pug]: http://jade-lang.com
[consolidate]: https://github.com/visionmedia/consolidate.js
[vinyl]: http://github.com/wearefractal/vinyl
[generator]: https://github.com/thisandagain/generator
[getting-started]: https://github.com/taunus/getting-started
