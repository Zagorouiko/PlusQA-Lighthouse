const fs = require("fs")

async function writeReviewstoFile(gptResponse, OS, appName){
    try {
    const files = await fs.promises.readdir(__dirname + `/CLI/reviews/${OS}`)
    const nameNospaces = appName.replace(/\s/g, '')

    const date = new Date();
    let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    
    fs.writeFile(`./reviews/${OS}/${files.length + 1}-${nameNospaces}：${day}-${month}-${year}.txt`, gptResponse, 'utf8', function (err) {
        if (err) throw err
      })
    } catch (err) {
      console.log(err)
    }   
  }

module.exports = { writeReviewstoFile }