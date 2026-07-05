import { NextRequest, NextResponse } from 'next/server';

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

    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const base64Image = imageBuffer.toString('base64');

    const prompt = `Look at this photograph. The person who shared it provided this context or note about it: "${contextNote || 'No additional context provided.'}"

Write a short caption (1-2 sentences) for this photo. The caption should be:
- Warm and genuine, like a caption for someone you respect and appreciate
- Specific to the context provided, not generic
- Natural and conversational in tone
- NOT romantic or relationship-implying (avoid words like "love", "dear", "always yours", etc.)
- Written from the perspective of someone who genuinely values this person

Keep it concise and meaningful.`;

    const body = {
      contents: [
        {
          parts: [
            { inlineData: { mimeType, data: base64Image } },
            { text: prompt },
          ],
        },
      ],
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gemini API error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    const caption = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!caption) {
      throw new Error('No caption in response');
    }

    return NextResponse.json({ caption });
  } catch (error) {
    console.error('Caption generation error:', error);
    return NextResponse.json({ error: 'Failed to generate caption' }, { status: 500 });
  }
}
