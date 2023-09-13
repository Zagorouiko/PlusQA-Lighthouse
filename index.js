const scraper = require('./pageController');
const helpers = require('./helpers');

// Start the browser and create a browser instance
function runScraper(appUrls, OS) {
    if (OS === 'iOS') {         
        scraper.scrapeAll(appUrls, OS);
    } if (OS === 'Android') {
        scraper.scrapeAll(appUrls, OS);
    } 
}

module.exports = runScraper;