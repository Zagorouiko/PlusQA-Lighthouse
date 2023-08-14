const fs = require("fs")

function writeReviewstoFile(gptResponse, OS, appName){
  const date = new Date();
  let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
  let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

  fs.writeFile(`./reviews/${OS}/${appName}-${day}-${month}-${year}.txt`, gptResponse, function (err) {
      if (err) throw err
    })
  }

  function splitAppUrls(appUrls) {
    let iOSApps = [];
    let AndroidApps = [];
    for (let i = 0; i < appUrls.length; i++) {
    try {
      if (appUrls[i].OS === "iOS") {
        iOSApps.push(appUrls[i]);
        
      } else if (appUrls[i].OS === "Android") {
        AndroidApps.push(appUrls[i]);
      }
    } catch (err) {
      console.log(err); 
    }
  }
    return [iOSApps, AndroidApps];
  }

module.exports = { writeReviewstoFile, splitAppUrls }