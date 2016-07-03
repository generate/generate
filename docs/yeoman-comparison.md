# Generator framework comparison

This table shows how Generate compares to other frameworks.

| **Feature** | **Google's Yeoman** | **Slush** | **Generate** | 
| --- | --- | --- | --- | --- | --- | --- |
| License | BSD-2-Clause © Google | MIT | MIT |
| CLI | yes | yes | yes |
| API | yes | gulp | yes |
| Easy to unit test | no | yes | yes |
| Tasks | no | gulp | yes |
| Streams (gulp plugins) | no | yes | yes |
| Generators | yes | gulpfiles | yes |
| Sub-generators | kind-of | no | yes |
| "Shared" instances | kind-of | no | yes |
| Template rendering | ejs | no | any engine |
| Template collections | no | no | yes |
| Supports assemble plugins | no | no | yes |
| Register helpers | no | no | yes |
| Register Async helpers | no | no | yes |
| Routes | no | no | yes |
| Middleware | no | no | yes |
| Instance plugins | no | no | yes |
| Config store | yes | no | yes |
| User interactions | yes | via plugins | yes |
| Flow control | prototype method names | tasks | tasks |
| Learning curve | steep | small | small |

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

Provided by [gulp][].

**Generate**

Same behavior and API as [gulp][] tasks (generate uses [bach][], created by the gulp team for gulp v4), with a couple of additional features:

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
