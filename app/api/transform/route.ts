import { NextRequest, NextResponse } from 'next/server';
import { transformText } from '@/lib/anthropic';
import { type FilterType } from '@/lib/prompts';

const MAX_INPUT_LENGTH = 8000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, filter } = body as { text: string; filter: FilterType };

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (text.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: `Text exceeds maximum length of ${MAX_INPUT_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (!filter || !['corporate', 'sales', 'hotdog'].includes(filter)) {
      return NextResponse.json(
        { error: 'Valid filter is required (corporate, sales, or hotdog)' },
        { status: 400 }
      );
    }

    const transformed = await transformText(text, filter);

    return NextResponse.json({ transformed });
  } catch (error) {
    console.error('Transform error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
