const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const runScraper = require('../index.js');
require('dotenv').config()
const fs = require("fs")
const appFinder = require('./AppFinder.js')
const ora = require('ora')
const path = require('path');

clear();

const warning = chalk.hex('#f04a00');

console.log(
  warning(chalk(
    figlet.textSync('PlusQA Lighthouse', 'graffiti', { horizontalLayout: 'full' })
  )
));

let iOSFileCount
let AndroidFileCount

(async () => {
  try {
    await fs.promises.readdir("./reviews")
  } catch (err) {
    await fs.promises.mkdir("./reviews")
    await fs.promises.mkdir("./reviews/iOS")
    await fs.promises.mkdir("./reviews/Android")
  }

  iOSFileCount = await fs.promises.readdir("./reviews/iOS", (err, files) => {
      if (err) { console.log(err) }
      return files
    })
  iOSFileCount = iOSFileCount.length

  AndroidFileCount = await fs.promises.readdir("./reviews/Android", (err, files) => {
    if (err) { console.log(err) }
    return files
  })
  AndroidFileCount = AndroidFileCount.length
})()

const run = async () => {
  const spinner = ora({text: 'Loading', color: 'red', indent: 1})
  fs.readFile("../config.json",  (err, data) => {
    if (err) { 
      inquirer
      .prompt([
          {
            name: 'OPENAI_API_KEY',
            type: 'input',
            message: 'Enter your OpenAI API Key:',
            validate: function (input) {
              // const done = this.async();
              if (input.length < 51 || input.indexOf("-") !== 2) {
                spinner.fail(`API Key is incorrect - Try again`)
                return
                // done('API Key is incorrect');
                // setTimeout(function() {                               
                //   run();
                //   done(null, true);
                // }, 2000);            
              }
              return true
            }
          },
          {
            name: 'OPENAI_ORGANIZATION_ID',
            type: 'input',
            message: 'Enter your OpenAI Organization ID:',
            validate: function (input) {
              if (input.length < 28 || input.indexOf("-") !== 3) {
                spinner.fail(`Organization ID is incorrect - Try again`)
                return
              }
              return true
            }
          },
          {
            name: 'SLACK_API_KEY',
            type: 'input',
            message: '(Optional) Enter your Slack API Key, otherwise press enter:',
            validate: function (input) {
              if (input.length === 0) { return true}
              if (input.length < 55 || input.indexOf("-") !== 4) {
                spinner.fail(`Slack API key is incorrect - Try again`)
                return
              }
              return true
            }
          },
          {
            name: 'SLACK_CHANNEL_ID',
            type: 'input',
            message: '(Optional) Enter your Slack Channel ID, otherwise press enter:',
            validate: function (input) {
              if (input.length === 0) { return true}
              if (input.length < 11) {
                spinner.fail(`Slack channel ID is incorrect - Try again`)
                return
              }
              return true
            }
          },
      ])
      .then((answers) => {
        fs.writeFileSync("../config.json", JSON.stringify(answers))
      })
      .catch((error) => {
        if (error.isTtyError) {
          console.log(error)
        } else {
          // Something else went wrong
        }
      });
    }
    if (data) {
      inquirer
      .prompt([
        {
          name: 'OS',
          type: 'list',
          message: 'Run Android or iOS?:',
          choices: ["iOS", "Android"],
        },
        {
          name: 'app',
          type: 'input',
          message: 'Search for an app:',
        },
      ])
      .then((answers) => {
      let appObject     
      const result = async () => {
        spinner.start()
        if (answers.OS === "iOS") {
          const iOSResult = await appFinder(answers.app, answers.OS)
          if (!iOSResult) {
            spinner.fail(`No search results - Restart please`)
            return
          }
          appObject = {
            OS: answers.OS,
            url: iOSResult.url,
            name: iOSResult.name,     
          }
        }

        if (answers.OS === "Android") {
          const androidResult = await appFinder(answers.app, answers.OS)
          if (!androidResult) {
            spinner.fail(`No search results - Restart please`)
            return
          }

          appObject = {
            OS: answers.OS,
            url: `https://play.google.com/store/apps/details?id=com.${androidResult.url}`,
            name: androidResult.name,     
          }
        }
        
        await runScraper(appObject, answers.OS)
        
        const monitorFolderAsync = async () => {
          try {
            const currentFiles = await fs.promises.readdir(`./reviews/${answers.OS}`)
            if (currentFiles.length === iOSFileCount + 1 || currentFiles.length === AndroidFileCount + 1) {
              const text = createFileLink(`./reviews/${answers.OS}/${currentFiles[currentFiles.length - 1]}`)
              spinner.succeed(`Created File ➜ ${text}`)
              return
            }
            if (iOSFileCount === currentFiles.length || AndroidFileCount == currentFiles.length) {
              setTimeout(monitorFolderAsync, 3000)
            }          
          } catch (err) {
            console.log(err)
          }
        }
        monitorFolderAsync() 
        
        function createFileLink(filePath) {
          const fileName = path.basename(filePath);
          return ` ${chalk.blue(fileName)} » (${chalk.underline(filePath)}) ${chalk.blueBright(('(ctrl+click)'))}`;
        }
      }
      result()       
      })
      .catch((error) => {
        if (error.isTtyError) {
          console.log(error)
        } else {
          // Something else went wrong
        }
      });
    }
  })
};

run();