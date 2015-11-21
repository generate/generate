'use strict';

module.exports = function(msg, items, inquirer) {
  var question = {
    name: 'me',
    type: 'checkbox',
    message: msg,
    choices: []
  };

  var choices = [];

  /**
   * Generate a list of checkboxes, one for each
   * missing dependency.
   */

  if (items.length > 1) {
    choices.push({name: 'all', value: items});
    choices.push(new inquirer.Separator('---'));
  }

  items.forEach(function(item) {
    choices.push({ name: item });
  });

  question.choices = choices;
  return question;
};
