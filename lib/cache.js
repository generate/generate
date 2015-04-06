'use strict';

/**
 * File cache, to prevent subsequent fs calls for the
 * same paths.
 *
 * This is only used on files that will or should never
 * change during the lifetime of this cache.
 */

module.exports = {}
