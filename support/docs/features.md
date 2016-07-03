---
title: Features
related:
  doc: ['faq']
---

* **unparalleled flow control**: through the use of [generators](docs/generators.md) and [tasks](docs/tasks.md)
* **render templates**: use templates to create new files, or replace existing files 
* **prompts**: It's easy to create custom prompts, and aswers to prompts can be used as context for rendering templates, for settings options, determining file names, directory structure, and anything else that requires user feedback.
* **any engine**: use any template engine to render templates, including [handlebars][], [lodash][], [swig][] and [pug][], and anything supported by [consolidate][].
* **data**: gather data from the user's environment for rendering templates, to populate "hints" in user prompts or for rendering templates, etc.
* **fs**: in the spirit of [gulp][], use `.src` and `.dest` to read and write globs of files.
* **vinyl**: files and templates are [vinyl][] files
* **streams**: full support for [gulp][] and [assemble][] plugins
* **smart plugins**: Update is built on [base][], so any "smart" plugin from the Base ecosystem can be used
* **stores**: persist configuration settings, global defaults, project-specific defaults, answers to prompts, and so on.
* much more! 


Visit the [getting started guide][getting-started] to learn more.