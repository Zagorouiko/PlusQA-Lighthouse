
const axios = require('axios');
const fs = require("fs");
const openai = require('openai')
require('dotenv').config()

const configuration = new openai.Configuration({
    organization: process.env.OPENAI_ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openaiInstance = new openai.OpenAIApi(configuration);

function messsageSlack(gptResponse) {
    const options = {
        headers: {
          Authorization:
            `Bearer ${process.env.SLACK_API_KEY}`,
        },
      };
    
      axios.post('https://slack.com/api/chat.postMessage', {
          channel: process.env.SLACK_API_CHANNEL,
          text: gptResponse
      }, options)
      .then((response) => {
      // console.log(response);
      }, (error) => {
      console.log(error);
      });
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
        The apps operating system is: ${app.OS} and the app name is: ${app.name} The reviews in JSON format are: ${reviews}`
      }],
      })
    } catch (error) {
      console.log(error)
    }
    return gpt3Response.data.choices[0].message.content
}

module.exports = { messsageSlack, chatGPTCall }