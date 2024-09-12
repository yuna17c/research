require('dotenv').config({path: '../../.env'});
import OpenAI from "openai";
import { INSTR_BEG, INSTR_END, INSTR_GENERIC } from '../../components/variables'

export default async function handler(req, res) {
  const client = new OpenAI();
  const { prompt } = req.body;
  const instruction_total = INSTR_GENERIC + INSTR_BEG + INSTR_END
  try {
    const response = await client.chat.completions.create({
      messages: [
        {"role": "system", "content": instruction_total},
        {"role": "user", "content": prompt},
      ],
      model: 'gpt-4o',
      max_tokens: 30,
      temperature: 1,
      n: 3,
      top_p: 0.55
    });
    const val = response.choices[0].message.content
    res.status(200).json({ response: val });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'can\'t retrieve results from openai.' });
  }
}
