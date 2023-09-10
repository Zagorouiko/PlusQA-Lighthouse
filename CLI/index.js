const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const runScraper = require('../index.js');
const androidAppUrlList = require('./AppUrls/android.js');
const iOSAppUrlList = require('./AppUrls/iOS.js');
require('dotenv').config()
const fs = require("fs")

clear();

let app
let OS

const warning = chalk.hex('#f04a00');

let androidText = warning(chalk.underline.bold('participantapp'))
let iOSText = warning(chalk.underline.bold('1164603213'))
let androidText2 = warning(chalk.underline.bold('Android'))
let iOSText2 = warning(chalk.underline.bold('iOS'))

console.log(
  warning(chalk(
    figlet.textSync('PlusQA Lighthouse', 'graffiti', { horizontalLayout: 'full' })
  )
));

//  If not run a few questions that setup env variables:

//  OPENAI_API_KEY=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
//  OPENAI_ORGANIZATION_ID=org-95AywUJeKBAVq6HcKJlbvFtE
//  SLACK_API_KEY=xoxb-79882577988-5716486558435-hLX7ccvD80a1yTw8yZyiD77l
//  SLACK_API_CHANNEL=C05M4V43HA8

const run = async () => {
  // clear()
    // Check if config file exists locally
  fs.readFile("./config.json",  (err, data) => {
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
                return 'API Key is incorrect - Restart and try again'
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
                return 'Organization ID is incorrect - Restart and try again'
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
                return 'Slack API key is incorrect - Restart and try again'
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
                return 'Slack channel ID is incorrect - Restart and try again'
              }
              return true
            }
          },
      ])
      .then((answers) => { 
        fs.writeFileSync("./config.json", JSON.stringify(answers))
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
      // console.log(JSON.parse(data).SLACK_API_KEY)
      inquirer
      .prompt([
          {
            name: 'OS',
            type: 'list',
            message: 'Run Android? iOS? or Both?:',
            choices: ["iOS", "Android", "Both"],
          },
          {
            name: 'appUrls',
            type: 'list',
            message: 'Run the default list of apps or a specific app?:',
            choices: ["default", "specific"],
            when: (answers) => answers.OS === 'iOS' || answers.OS === 'Android',
          },
          {
            name: 'appUrls',
            type: 'list',
            message: 'Run the default list',
            choices: ["default"],
            when: (answers) => answers.OS === 'Both',
          },
          {
            name: 'specificID',
            type: 'input',
            message: `What is the app store id?
            (Example ${androidText2}: https://play.google.com/store/apps/details?id=com.${androidText} | Example ${iOSText2}: https://apps.apple.com/us/app/virta-health/id${iOSText}):`,
            when: (answers) => answers.appUrls === 'specific',
          },
          {
            name: 'specificName',
            type: 'input',
            message: 'What is the app name?:',
            when: (answers) => answers.specificID !== undefined,
          },
      ])
      .then((answers) => {
    
        if (answers.appUrls === 'default' && answers.OS === 'Both') {
          app = androidAppUrlList.concat(iOSAppUrlList)
          OS = answers.OS
        }
    
        if (answers.appUrls === 'default' && answers.OS === 'Android') {
          app = androidAppUrlList
          OS = answers.OS
        }
    
        if (answers.appUrls === 'default' && answers.OS === 'iOS') {
          app = iOSAppUrlList
          OS = answers.OS
        }
    
        if (answers.appUrls === 'specific' && answers.OS === 'iOS') {    
          let appObject = [{
            OS: answers.OS,
            id: answers.specificID,
            name: answers.specificName,     
          }] 
          app = appObject
          OS = answers.OS
        }
    
        if (answers.appUrls === 'specific' && answers.OS === 'Android') {
          let appObject = [{
            OS: answers.OS,
            url: `https://play.google.com/store/apps/details?id=com.${answers.specificID}`,
            name: answers.specificName,     
          }] 
          app = appObject
          OS = answers.OS
        }
    
        runScraper(app, OS);
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