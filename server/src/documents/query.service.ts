import { Injectable } from '@nestjs/common';
import { SearchService } from '../ai/search.service';
import { LlmService } from '../ai/llm.service';

@Injectable()
export class QueryService {
  constructor(
    private readonly searchService: SearchService,
    private readonly llmService: LlmService,
  ) {}

  async query(documentId: number, question: string) {
    // 1. Find relevant chunks
    const results = await this.searchService.search(
      documentId,
      question,
      3,
    );

    // 2. Build context for the LLM
    const context = results
      .map(
        (result, index) =>
          `[Source ${index + 1}]\n${result.content}`,
      )
      .join('\n\n');

    // 3. Ask the LLM to answer using that context
    const answer = await this.llmService.generateAnswer(
      question,
      context,
    );

    return {
      question,
      answer,
      sources: results.map((result, index) => ({
        source: index + 1,
        chunkId: result.chunkId,
        chunkIndex: result.chunkIndex,
        score: result.score,
        content: result.content,
      })),
    };
  }
}