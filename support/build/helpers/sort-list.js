'use strict';

var camelcase = require('camel-case');

/**
 * Filter and sort "items" from an assemble `List` before rendering.
 * For instance, you can use assemble's built-in `pages` block helper
 * to create a List from the pages collection (every collection has
 * a corresponding block helper).
 *
 * ```handlebars
 * {{#if @site.nav.main}}
 *   {{#pages}}
 *     {{#each (sort-list items @site.nav.main) as | item |}}
 *     <li class="nav-item {{#is @root.page.stem item.stem}}active{{/is}}">
 *       <a class="nav-link" href="{{link-to item.relative}}">{{titleize (default item.data.link item.data.title)}}</a>
 *     </li>
 *     {{/each}}
 *   {{/pages}}
 * {{/if}}
 * ```
 *
 * @param {Array} `items`
 * @param {Array} `order` An array that describes the expected order of items.
 * @param {Object} `options`
 * @return {Array}
 * @api public
 */

module.exports = function(items, order, options) {
  if (!Array.isArray(order)) {
    return items;
  }
  var len = order.length;
  var arr = new Array(len);
  for (var i = 0; i < len; i++) {
    var item = filterItem(items, order[i]);
    if (item) {
      arr.push(item);
    }
  }
  return arr;
};

function filterItem(items, name) {
  var len = items.length;
  for (var i = 0; i < len; i++) {
    var item = items[i];
    if (camelcase(item.stem) === camelcase(name)) {
      return item;
    }
  }
}
