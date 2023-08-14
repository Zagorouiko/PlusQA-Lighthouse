const axios = require("axios");
const api = require('./API-requests')
const helpers = require("./helpers");

const scraperObject = {
  async scraper(appUrls) {
    for (i = 0; i < appUrls.length; i++) {   
      let entriesArray = [];
      let concattedArray = [];
      for (j = 0; j < 10; j++) {
        // Make api call to https://itunes.apple.com/us/rss/customerreviews/page=1/id=1164603213/sortby=mostrecent/json
        let jsonFeed = await axios.get(
          `https://itunes.apple.com/us/rss/customerreviews/page=${j + 1}/id=${appUrls[i].id}/sortby=mostrecent/json`);

        if (j === 0) {
          entriesArray = jsonFeed.data.feed.entry;
        }

        if (j !== 0) {
          concattedArray = concattedArray.concat(jsonFeed.data.feed.entry);
        }
      }

      const finalArray = entriesArray.concat(concattedArray);
      const filteredFinalArray = finalArray.filter(function (el) {
        return el != null
      })

      // Iterate over the JSONs entry property array and only keep only the array object items that have rating 3 or less
      const filteredFinalArrayWithRating = filteredFinalArray.filter((item) => {
        if (item["im:rating"] !== undefined) {
          let rating = parseInt(item["im:rating"].label);
          if (rating <= 3) {
            return item.content.label;
          }
        }
      });

      // Iterate over the JSONs entry property array and only keep only the array object items that have date not older than 3 months
      const threeMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 3))
      const filteredFinalArrayWithDateRatings = filteredFinalArrayWithRating.filter((item) => {
        if (item.updated.label !== undefined) {
          let itemDate = Date.parse(item.updated.label)
          if (threeMonthsAgo <= itemDate) {
            return item.content.label;
          }
        }
      });

    // Iterate again and create new object only keeping the version (app build version) and content.label properties
    let reviewObject = filteredFinalArrayWithDateRatings.map((item) => { 
      let obj = {
        version: item["im:version"].label,
        review: item.content.label
      }
      return obj;
    })

    // FOR TESTING
    // const reducedReviews = []
    // for (k = 0; k < 8; k++) { 
    //   reducedReviews.push(reviewObject[i])
    // }

    const gptResponse = await api.chatGPTCall(appUrls[i], reviewObject)
    helpers.writeReviewstoFile(gptResponse, 'iOS', appUrls[i].name)
    await api.messsageSlack(gptResponse)

    // Clear reviews
    reviewObject = []
    }
  }
};

module.exports = scraperObject;
