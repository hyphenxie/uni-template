var inquirer = require('inquirer')

module.exports = function (questions = []) {
    return inquirer
        .prompt(questions)
        .then(answers => {
            return answers
        })
        .catch(error => {
            const chalk = require('chalk')
            console.log(chalk.red(JSON.stringify(error)))
        })
}
