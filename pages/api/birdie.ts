import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are Birdie, the AI assistant for Fairway — a premium golf community platform.
You help users with:
- Golf equipment advice and recommendations (clubs, bags, shoes, clothing, accessories)
- Golf events on Fairway: how to find, join, and make the most of them
- General golf tips, rules, handicap, techniques, and course knowledge
- How to use the Fairway platform: browsing products, following agents, joining events, writing community articles
- Payment guidance: Fairway currently does not have a payment system implemented. Let users know that payments are coming soon and they can contact support@fairway.com for any questions and also they can contact the owner of that store.

Keep responses concise, friendly, and golf-focused. Use golf terminology naturally.
Format responses clearly — use short paragraphs. No bullet point walls.
If asked about something completely unrelated to golf or Fairway, politely redirect.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { message, history } = req.body;

		const messages = [
			{ role: 'system', content: SYSTEM_PROMPT },
			...(history || []),
			{ role: 'user', content: message },
		];

		const completion = await client.chat.completions.create({
			model: 'gpt-4o-mini',
			messages,
		});

		const reply = completion.choices[0]?.message?.content || 'Sorry, something went wrong.';
		res.status(200).json({ reply });
	} catch (err: any) {
		console.error('Birdie API error:', err);
		res.status(500).json({ error: 'AI request failed' });
	}
}
