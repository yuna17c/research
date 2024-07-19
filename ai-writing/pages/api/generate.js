import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
require('dotenv').config({path: '../../.env.local'});
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_KEY;
import OpenAI from "openai";

export default async function handler(req, res) {
  const prompt = req.query.prompt
  console.log("received:", prompt)
  const openai = new OpenAI();
  const response = await openai.chat.completions.create({
    model:"gpt-3.5-turbo",
    messages:[
        {"role": "system", "content": "You are a helpful assistant who writes the next sentence of a user who is writing an email. You want to help them write an email altogether."},
        {"role": "user", "content": prompt},
    ],
    temperature:1,
    max_tokens:50,
    n:3,
    top_p:0.55
  });
  const val = response.choices[0].message.content
  console.log("generated response:",val)
  // res.json({val});
  // const val = "I am eating ice cream."
  res.status(200).json({ response: val });
}
  
  // const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey))
  // try {
  //   const response = await client.getCompletions('selena_completion', [prompt], {
  //     maxTokens: 32,
  //     temperature:1
  //   });
  //   let val = response.choices[0].text
  //   console.log(val)
  //   // cut to a sentence
  //   let periodIdx = val.indexOf('.');
  //   if (periodIdx!==-1) {
  //     val = val.substring(0,periodIdx+1)
  //   }
  //   res.status(200).json({ response: val });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: 'can\'t retrieve results from openai.' });
  // }}
