import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
console.log(process.env.GROQ_API_KEY);
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const getSystemPrompt = (input) => {
    let userContent = '';

    if (input.generationType === 'structured') {
        const { title, eventType, category } = input.details;
        userContent = `Flesh out the details for an event with the following specifics:
        - Title: "${title}"
        - Type: "${eventType}"
        - Category: "${category}"
        
        Generate a creative and engaging description, a suitable date and time in the near future, and plausible venue/pricing details.`;
    } 
    else {
        userContent = `Generate event details based on this idea: "${input.prompt}"`;
    }

    const systemPrompt = `
      You are an expert event planner. Based on the user's request, generate a complete set of event details.
      Your response MUST be a single, valid JSON object with no extra text, explanations, or markdown.
      The JSON object MUST conform to this exact structure:
      {
        "title": "string",
        "description": "string (at least 60 words)",
        "imageUrl": "string (a plausible image URL from https://images.unsplash.com/)",
        "eventType": "string (one of: 'conference', 'workshop', 'seminar', 'networking', 'other')",
        "category": "string (one of: 'technology', 'business', 'marketing', 'design', 'other')",
        "date": "string (format: YYYY-MM-DD, must be a future date)",
        "time": "string (format: HH:MM)",
        "maxAttendees": "number",
        "venueType": "string (one of: 'physical' or 'online')",
        "venue": "string (name of the place, required if venueType is 'physical')",
        "city": "string (required if venueType is 'physical')",
        "platform": "string (e.g., 'Zoom', required if venueType is 'online')",
        "meetingLink": "string (a sample URL, required if venueType is 'online')",
        "isFreeEvent": "boolean",
        "price": "number (required if isFreeEvent is false, otherwise 0)"
      }
    `;

    return { systemPrompt, userContent };
};

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.generationType || (body.generationType === 'prompt' && !body.prompt) || (body.generationType === 'structured' && !body.details)) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { systemPrompt, userContent } = getSystemPrompt(body);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 1,
            response_format: { type: 'json_object' },
        });

        const jsonResponse = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
        
        return NextResponse.json({
            success: true,
            message: "Event generated successfully!",
            data: jsonResponse,
        });

    } catch (error) {
        console.error('Error generating event with GROQ:', error);
        return NextResponse.json({ error: 'Failed to generate event.' }, { status: 500 });
    }
}
