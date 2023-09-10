const axios = require("axios");
const browserObject = require('../browser');

  async function appSearcher() {
    let browser = await browserObject.startBrowser();
    let page = await browser.newPage();
    console.log(`Navigating to Playstore`);
    await page.goto("https://play.google.com/");
  }

module.exports = { appSearcher }
