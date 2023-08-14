const chalk = require('chalk');
const chalkAnimation = require('chalk-animation')
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/files');
// const inquirer  = require('./lib/inquirer');
const inquirer = require('inquirer');
const runScraper = require('../index.js');
const androidAppUrlList = require('./AppUrls/android.js');
const iOSAppUrlList = require('./AppUrls/iOS.js');
require('dotenv').config()

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

const run = async () => {
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
};

run();