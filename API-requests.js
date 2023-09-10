
const axios = require('axios');
const fs = require("fs");
const openai = require('openai')
require('dotenv').config()

// RETEST
fs.readFile("./CLI/config.json",  (err, data) => {
  if (err) {
    console.log(err)
    return 
  }
  if (data) {
    const OPENAI_API_KEY = JSON.parse(data).OPENAI_API_KEY
    const OPENAI_ORGANIZATION_ID = JSON.parse(data).OPENAI_ORGANIZATION_ID

    const configuration = new openai.Configuration({
      organization: OPENAI_ORGANIZATION_ID,
      apiKey: OPENAI_API_KEY,
    });
    const openaiInstance = new openai.OpenAIApi(configuration);
  }
 })

// RETEST
function messsageSlack(gptResponse) {
  fs.readFile("./CLI/config.json",  (err, data) => { 
    if (err) {
      console.log("No/incorrect Slack API key")
      return
    }
    if (data) {
      const SLACK_API_KEY = JSON.parse(data).SLACK_API_KEY
      const SLACK_CHANNEL_ID = JSON.parse(data).SLACK_CHANNEL_ID

      const options = {
        headers: {
          Authorization:
            `Bearer ${SLACK_API_KEY}`,
        },
      };
    
      axios.post('https://slack.com/api/chat.postMessage', {
          channel: SLACK_CHANNEL_ID,
          text: gptResponse
      }, options)
      .then((response) => {
      // console.log(response);
      }, (error) => {
      console.log(error);
      });
    }
  })
}

async function chatGPTCall(app, reviews) {

    let gpt3Response
    try {
      gpt3Response = await openaiInstance.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: 
        `
        I want to create a categorized list of issues of an app based on user reviews. Please filter out any subjective reviews.
        I've included the app name, operating system, and reviews. Specify the operating system and app name at the top of the response.
        Give me specific areas in the app to focus testing on and specific problems based on the reviews provided, also list the specific issue the users found. 
        Also provide specific actionable steps for manually testing those areas.
        The apps operating system is: ${app.OS} and the app name is: ${app.name} The reviews are: ${reviews}`
      }],
      })
    } catch (error) {
      console.log(error)
    }
    return gpt3Response.data.choices[0].message.content
}

module.exports = { messsageSlack, chatGPTCall }