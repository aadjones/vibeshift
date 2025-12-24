import Anthropic from '@anthropic-ai/sdk';
import { filterPrompts, type FilterType } from './prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function transformText(text: string, filter: FilterType): Promise<string> {
  const systemPrompt = filterPrompts[filter];

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: text
      }
    ]
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  return content.text;
}
