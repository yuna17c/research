import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
require('dotenv').config({path: '../../.env.local'});
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_KEY;

export default async function handler(req, res) {
  const prompt = req.query.prompt
  console.log("received:", prompt)
  const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey))  
  const task = [`Finish the following email text: ${prompt} `]
  try {
    const response = await client.getCompletions('selena_completion', [prompt], {
      maxTokens: 32,
      temperature:1
    });
    let val = response.choices[0].text
    console.log(val)
    // cut to a sentence
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