require('dotenv').config({path: '../../.env'});
import OpenAI from "openai";
import { system_instr_neg, system_instr_pos, instruction_pos, instruction_neg } from '../../components/system-instr'

export default async function handler(req, res) {
  const client = new OpenAI();
  const { prompt, ai_type } = req.body;
  const system_instr = ai_type=='pos' ? system_instr_pos : system_instr_neg
  const instruction = ai_type=='pos' ? instruction_pos : instruction_neg
  try {
    const response = await client.chat.completions.create({
      messages: [
        {"role": "system", "content": system_instr},
        {"role": "system", "content": instruction},
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
