import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, contextNote } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });

    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    const prompt = `Look at this photograph. The person who shared it provided this context or note about it: "${contextNote || 'No additional context provided.'}"

Write a short caption (1-2 sentences) for this photo. The caption should be:
- Warm and genuine, like a caption for someone you respect and appreciate
- Specific to the context provided, not generic
- Natural and conversational in tone
- NOT romantic or relationship-implying (avoid words like "love", "dear", "always yours", etc.)
- Written from the perspective of someone who genuinely values this person

Keep it concise and meaningful.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    const caption = message.content[0].type === 'text'
      ? message.content[0].text.trim()
      : 'Could not generate caption.';

    return NextResponse.json({ caption });
  } catch (error) {
    console.error('Caption generation error:', error);
    return NextResponse.json({ error: 'Failed to generate caption' }, { status: 500 });
  }
}
