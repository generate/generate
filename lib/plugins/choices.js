'use strict';

var chalk = require('chalk');

module.exports = function(msg, items) {
  var question = {
    type: 'checkbox',
    name: 'me',
    message: msg,
    choices: []
  };

  /**
   * Create the `all` choice
   */

  if (items.length > 1) {
    question.choices.push({name: 'all', value: items});
    question.choices.push({type: 'separator', line: chalk.gray('——————')});
  }

  /**
   * Generate the list of choices
   */

  items.forEach(function(item) {
    question.choices.push({ name: item });
  });

  return question;
};
