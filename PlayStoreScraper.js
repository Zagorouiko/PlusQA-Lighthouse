const api = require("./API-requests");
const helpers = require("./helpers");

const scraperObject = {
  async scraper(browser, appUrls) {
    for (i = 0; i < appUrls.length; i++) {
      let page = await browser.newPage();
      console.log(`Navigating to ${appUrls[i].url}...`);
      await page.goto(appUrls[i].url);

      // Wait for the reviews section to load
      await page.waitForSelector(".tU8Y5c");

      // Open/click the "See all Reviews" modal
      let linkElements = await page.$$(".VfPpkd-vQzf8d");

      for (let j = 0; j < linkElements.length; j++) {
        let text = await page.evaluate((el) => el.innerText, linkElements[j]);
        if (text.indexOf("See all reviews") > -1) {
          await linkElements[j].click();
        }
      }
      // Wait for the modal to load
      await page.waitForSelector(".VfPpkd-cnG4Wd");

      async function grabReviews(page) { 
        const reviews = await page.evaluate(() => {
          const reviewElements = document.querySelectorAll(".RHo1pe");
          const ratingElements = document.querySelectorAll(".iXRFPc");
          const dateElements = document.querySelectorAll(".bp9Aid");
          let reviews = [];      
          let rating
          let date
          let review

          // First 3 reviews repeat on the front page so iteration must be offset
          for (n = 3; n < reviewElements.length; n++) {
            rating = ratingElements[n].getAttribute("aria-label");
            date = dateElements[n].innerText;

            if (n < 6) {
              review = reviewElements[n-3].querySelector(".h3YV2d").innerText;
            } else {
              review = reviewElements[n-3].querySelector(".h3YV2d").innerText;
            }

            if (!review || !rating || !date) { continue }

            let obj = {
              rating: rating,
              date: date,
              review: review,
            };

            reviews.push(obj);
          }
          return reviews
        });

      // Filter by year
      const filteredArray = reviews.filter(function (el) { 
        if (el.date.includes(" 2023")) {
        return el
        }
      })

      // Filter by rating
      const finalFilteredArray = filteredArray.filter(function (el) { 
        if (el.rating.includes("3") || el.rating.includes("2") || el.rating.includes("1")) {
        return el
        }
      })

      let finalReviews = []
      for (z = 0; z < finalFilteredArray.length; z++) { 
        let obj = {
          review: finalFilteredArray[z].review,
        };
        finalReviews.push(obj);
      }

    // FOR TESTING
    const reducedReviews = []
    if (finalReviews.length > 1000) { 
      for (k = 0; k < 5000; k++) { 
        reducedReviews.push(finalReviews[k])
      }
    }

      const gptResponse = await api.chatGPTCall(appUrls[i], reducedReviews)
      helpers.writeReviewstoFile(gptResponse, 'Android', appUrls[i].name)
      await api.messsageSlack(gptResponse)
    }

      const targetDivClassName = "fysCi";
      const scrollTargetDivToBottom = async () => {
        await page.evaluate(targetDivClassName => {
          const targetDiv = document.querySelector(`.${targetDivClassName}`);
          if (targetDiv) {
            targetDiv.scrollTop = targetDiv.scrollHeight;
          }
        }, targetDivClassName);
      };
    
      // Scroll down the infinite loading modal
      let previousHeight = 0;
      let currentHeight = await page.evaluate(targetDivClassName => {
        const targetDiv = document.querySelector(`.${targetDivClassName}`);
        return targetDiv ? targetDiv.scrollHeight : 0;
      }, targetDivClassName);
    
      while (previousHeight !== currentHeight) {
        await scrollTargetDivToBottom();
        await page.waitForTimeout(1000); // Wait for a brief moment for new content to load
    
        previousHeight = currentHeight;
        currentHeight = await page.evaluate(targetDivClassName => {
          const targetDiv = document.querySelector(`.${targetDivClassName}`);
          return targetDiv ? targetDiv.scrollHeight : 0;
        }, targetDivClassName);
      }
      await grabReviews(page)
    }
  },
};

module.exports = scraperObject;
