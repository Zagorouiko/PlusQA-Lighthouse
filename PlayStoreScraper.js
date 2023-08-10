const api = require("./API-requests")

const scraperObject = {
  // url: 'https://play.google.com/store/apps/details?id=com.participantapp',
  async scraper(browser, appUrls) {
    for (i = 0; i < appUrls.length; i++) {
      let page = await browser.newPage();
      console.log(`Navigating to ${appUrls[i].url}...`);
      // Navigate to the selected page
      await page.goto(appUrls[i].url);

      // Wait for the reviews section to load
      await page.waitForSelector(".tU8Y5c");

      // Open/click the "See all Reviews" modal
      let linkElements = await page.$$(".VfPpkd-vQzf8d");

      for (let i = 0; i < linkElements.length; i++) {
        let text = await page.evaluate((el) => el.innerText, linkElements[i]);
        if (text.indexOf("See all reviews") > -1) {
          await linkElements[i].click();
        }
      }

      // Wait for the modal to load
      await page.waitForSelector(
        "button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.ksBjEc.lKxP2d.LQeN7.aLey0c"
      );
      await page.waitForSelector(".jgIq1");

      // Filter reviews by 3 stars or less (evaluate)
      // Click rating dropdown
      // let dropdownElements = await page.$$(".kW9Bj");

      // for (let i = 0; i < dropdownElements.length; i++) {
      //   let text = await page.evaluate((el) => el.innerText, dropdownElements[i]);
      //   if (text.indexOf("Star rating") > -1) {         
      //     console.log("clicking dropdown")
      //     await dropdownElements[i].click();
      //   }
      // }
      // await page.waitForSelector(".JPdR6b.e5Emjc.ah7Sve.qjTEB");

      // // Click star rating
      // await page.waitForSelector(".z80M1.NmX0eb.KnEF3e");
      // let starElements = await page.$$(".z80M1.NmX0eb.KnEF3e");

      // for (let i = 0; i < starElements.length; i++) {
      //   let text = await page.evaluate((el) => el.innerText, starElements[i]);
      //   if (text.indexOf("3-star") > -1) {
      //     console.log(text.indexOf("3-star"))
      //     console.log("clicking star rating")
      //     // await page.click(starElements[i])      
      //     await starElements[i].click();
      //   }
      // }
      // let n = await page.$$("#filterBy_3")
      // await page.waitForSelector(n);

      const reviews = await page.evaluate(() => {
        const reviewElements = document.querySelectorAll(".RHo1pe");
        const reviews = [];

        for (const element of reviewElements) {
          const content = element.querySelector(".h3YV2d").innerText;
          let obj = {
            review: content,
          };
          reviews.push(obj);
        }

        return reviews;
      });
      // console.log(reviews);
      // const gptResponse = await api.chatGPTCall(appUrls[i], reviews)
      // await api.messsageSlack(gptResponse)
    }
  },
};

module.exports = scraperObject;
