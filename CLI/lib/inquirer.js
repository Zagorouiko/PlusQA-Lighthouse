const inquirer = require('inquirer');

module.exports = {
  askGithubCredentials: () => {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Run the default projects or a specific project(Enter "default" or "specific"):',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter a value';
          }
        }
      },

    ];
    return inquirer.prompt(questions);
  },
};
