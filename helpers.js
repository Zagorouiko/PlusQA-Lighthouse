function writeReviewstoFile(reviews){
    fs.writeFile(
        "reviews.json",
        JSON.stringify(reviews),
        "utf8",
        function (err) {
          if (err) throw err;
        }
      );
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