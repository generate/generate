'use strict';

/**
 * Metadata for the current `app.runner`
 */

module.exports = function(app) {
  app.data({
    runner: {
      name: 'generate',
      url: 'https://github.com/generate/generate'
    }
  });
};
