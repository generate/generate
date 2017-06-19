'use strict';

/**
 * Log the given value(s) to the console. Play around with this
 * helper to get a better understanding of what the context is
 * in various places throughout your templates.
 *
 * ```js
 * {{log .}}
 * {{log this}}
 * {{log data}}
 * {{log page}}
 * {{log site}}
 * {{log (someHelper .)}}
 * ```
 * @return {undefined}
 */

module.exports = function() {
  var args = [].slice.call(arguments);
  args.pop();
  console.log.apply(console, args);
};
