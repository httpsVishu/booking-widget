import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a booking system configurator. 
Given a business description, extract a structured schema for their booking system.
Return ONLY valid JSON matching this exact shape:
{
  "businessName": "string",
  "services": [
    { "id": "string (slug)", "name": "string", "duration": number (minutes), "deposit": number (USD) }
  ],
  "workingDays": ["Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday"|"Sunday"],
  "workingHours": { "start": "HH:MM", "end": "HH:MM" },
  "slotInterval": number (minutes, typically matches shortest service duration)
}
Extract 3-6 services. Be realistic about durations and deposit amounts based on industry norms.`;

export async function extractSchema(prompt) {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
}