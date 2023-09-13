const browserObject = require('../browser');

  async function appFinder(searchTerm, OS) {
    let appID
    let appName
    let browser = await browserObject.startBrowser();
    let page = await browser.newPage();
    if (OS === "Android") {
      await page.goto(`https://play.google.com/store/search?q=${searchTerm.toLowerCase()}&c=apps`);

      try {
      // On search results page - Click on title
      await page.waitForSelector(".XUIuZ");
      const appTitle = await page.$$(".XUIuZ")
      const appLink = await appTitle[0].$('a')

      // Get the app link
      appID = await page.evaluate((element) => {
          return element.getAttribute('href');
      }, appLink);

      // Get the app name
      appName = await page.evaluate(() => {
        const element = document.querySelector('.vWM94c').innerText
        return element
      })
  
      if (appName.includes(":")) {
        appName = appName.substring(0, appName.indexOf(":"))
      }  

      appID = appID.substring(appID.indexOf(".") + 1, appID.length)
    } catch (err) {
      return
    }
    }

    if (OS === "iOS") {
      await page.goto(`https://www.apple.com/us/search/${searchTerm.toLowerCase()}?src=globalnav`);


      try {
        await page.waitForSelector(".rf-serp-search-tabcontainer");
        const appTitle = await page.$$(".rf-serp-productname")
        const appLink = await appTitle[0].$('a')
  
        // Get the app link
        appID = await page.evaluate((element) => {
          return element.getAttribute('href');
        }, appLink);   
        appID = appID.match(/(\d+)/)[0]
  
      // Get the app name
        appName = await page.evaluate((el) => el.innerText, appTitle[0]);
  
      } catch (err) {
        return
      }

    // ______________Older Scraping___________________ 
    //   // On search results page - Click on title
    //   await page.waitForSelector("#SetAos");
    //   const appTitle = await page.$$("#SetAos > div")
    //   const appLink = await appTitle[0].$('a')

    //   // Get the app link
    //   appID = await page.evaluate((element) => {
    //     return element.getAttribute('href');
    // }, appLink);   
    //   appID = appID.match(/(\d+)/)[0]

    //   // Get the app name
    //   const titleElements = await page.$$("#SetAos > div > div > h2")
    //   appName = await page.evaluate((el) => el.innerText, titleElements[0]);
    }

    const appObject = {
      name: appName,
      url: appID
    }
    return appObject
  }

module.exports = appFinder 
