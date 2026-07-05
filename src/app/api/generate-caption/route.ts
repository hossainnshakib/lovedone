import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, contextNote } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const base64Image = imageBuffer.toString('base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Look at this photograph. The person who shared it provided this context or note about it: "${contextNote || 'No additional context provided.'}"

Write a short caption (1-2 sentences) for this photo. The caption should be:
- Warm and genuine, like a caption for someone you respect and appreciate
- Specific to the context provided, not generic
- Natural and conversational in tone
- NOT romantic or relationship-implying (avoid words like "love", "dear", "always yours", etc.)
- Written from the perspective of someone who genuinely values this person

Keep it concise and meaningful.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    const result = await model.generateContent([imagePart, prompt]);
    const caption = result.response.text().trim();

    return NextResponse.json({ caption: caption || 'Could not generate caption.' });
  } catch (error) {
    console.error('Caption generation error:', error);
    return NextResponse.json({ error: 'Failed to generate caption' }, { status: 500 });
  }
}
