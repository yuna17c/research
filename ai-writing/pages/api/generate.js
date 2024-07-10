import OpenAI from "openai";
import { NextResponse } from "next/server";
require('dotenv').config({path: '../../.env'});

export default async function handler(req, res) {
  const prompt = req.query.prompt
  console.log("received:", prompt)
  const openai = new OpenAI();
  res.status(200).json({name:'john doe'})
  // try {
  //   const response = await openai.chat.completions.create({
  //     model:"gpt-3.5-turbo",
  //     messages:[
  //         {"role": "system", "content": "You are a helpful assistant who completes the sentence of a user who is writing an email."},
  //         {"role": "user", "content": prompt},
  //     ],
  //     temperature:1,
  //     max_tokens:50,
  //     n:3,
  //     top_p:0.55
  //   });
  //   const val = response.choices[0].message.content
  //   const val = "hello!d"
  //   console.log("generated response:",val)
  //   // res.json({val});
  //   res.status(200).json({ response: val });
  //   // return new NextResponse.json({message:"hello"})    // res.status(200).json({ val });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: 'can\'t retrieve results from openai.' });
  // }
} 