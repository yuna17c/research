require('dotenv').config({path: '../../.env'});
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_KEY;
const apiVersion = '2023-05-15';
const { AzureOpenAI } = require("openai");

export default async function handler(req, res) {
  const client = new AzureOpenAI(
    { endpoint, apiKey, apiVersion }
  );
  const prompt = req.query.prompt
  console.log("received:", prompt)
  const instruction = "You are a helpful assistant who completes the sentence of a user who is writing an email. Add one sentence continuing the email in a polite manner asking an alumnus of the user's colleague who works at a company the user is interested in if they would speak with the user about their company in a video call."
  try {
    const response = await client.chat.completions.create({
      messages: [
        {"role": "system", "content": instruction},
        {"role": "user", "content": prompt},
      ],
      model: 'gpt4'
    });
    let val = response.choices[0].message.content
    console.log(val)
    // Cut to a single sentence
    let periodIdx = val.indexOf('.');
    if (periodIdx!==-1) {
      val = val.substring(0,periodIdx+1)
    }
    res.status(200).json({ response: val });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'can\'t retrieve results from openai.' });
  }
}
