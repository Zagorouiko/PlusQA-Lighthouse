const androidScraper = require('./PlayStoreScraper');
const iOSScraper = require('./AppleStoreScraper');
const browserObject = require('./browser');

async function scrapeAll(appUrls, OS){

	if (OS === 'Android') { 
		try{
			let browser = await browserObject.startBrowser();
			await androidScraper.scraper(browser, appUrls);	
		}
		catch(err){
			console.log("Could not resolve the browser instance => ", err);
		}
	}

	if (OS === 'iOS') { 
		try{
			await iOSScraper.scraper(appUrls);	
		}
		catch(err){
			console.log("Could not resolve the browser instance => ", err);
		}
	}
}

module.exports = { scrapeAll }