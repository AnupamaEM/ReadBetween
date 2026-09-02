import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class LlmService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateAnswer(
    question: string,
    context: string,
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `
You are a terms and policy assistant.

Answer the user's question using ONLY the provided context.

Rules:
- Do not make up information.
- If the answer is not present in the context, say that the information is not available in the provided document.
- Keep the answer concise and clear.
- Do not use outside knowledge.
          `.trim(),
        },
        {
          role: 'user',
          content: `
Context:
${context}

Question:
${question}
          `.trim(),
        },
      ],
    });

    return response.choices[0]?.message?.content ?? '';
  }
}