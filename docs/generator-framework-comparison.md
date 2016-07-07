# Generator framework comparison

This table shows how Generate compares to other frameworks.

| **Feature** | **Generate** | **Google's Yeoman** | **Slush** | 
| --- | --- | --- | --- |
| License | MIT | BSD-2-Clause © Google | MIT |
| Learning curve | small | steep | small |
| CLI | yes | yes | yes |
| API | yes | yes | gulp |
| Easy to unit test | yes | no | yes |
| Tasks | yes | no | gulp |
| Streams | yes | kind of | yes |
| Generators | yes | yes | gulpfiles |
| Sub-generators | yes | kind of | no |
| Template rendering | any engine | ejs | no |
| Template collections | yes | no | no |
| Supports assemble plugins | yes | no | no |
| Register helpers | yes | no | no |
| Register Async helpers | yes | no | no |
| Render cycle | yes | no | no |
| Middleware | yes | no | no |
| Plugins | yes | no | no |
| Pipeline plugins | yes | no | yes |
| Config store | yes | yes | no |
| User interactions | yes | during "prompting" stage | via plugins |
| Flow control | tasks | prototype method names | tasks |

## Templates

**Yeoman**

ejs?

**Slush**

Any gulp plugin.

**Generate**

Both of the above, and:

* render templates with any template engine
* support for consolidate engines
* support for layouts
* support for partials
* support for helpers
* support for async helpers
* template collections
* complete render cycle
* middleware support

## Tasks

**Yeoman**

Yeoman's concept of "tasks" is [Prototype methods as actions](http://yeoman.io/authoring/running-context.html). We found this to be a very limiting and confusing approach.

**Slush**

Provided by [gulp](http://gulpjs.com).

**Generate**

Same behavior and API as [gulp](http://gulpjs.com) tasks (generate uses [bach](https://github.com/gulpjs/bach), created by the gulp team for gulp v4), with a couple of additional features:

* Task-dependencies can be specified in any order with generate, but not in gulp (in gulp, )

**Bottom line**

Generate doesn't impose any limitations on how many tasks you have, or the order of execution. Tasks can even be run more than once during a build cycle when it makes sense.

## Sub-generators

**Yeoman**

Syntax: `foo:bar`

Sub-generators are created using project sub-folders.

**Slush**

N/A

**Generate**

Sub-generators are just generators, registered with the `.register()` method. Sub-generators can be local, in sub-folders, in the same file, in `node_modules`, published to `npm`
