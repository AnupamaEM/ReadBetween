import { Injectable } from '@nestjs/common';
import { db } from '../database/database';
import { documentChunks } from '../database/schema';
import { eq } from 'drizzle-orm';
import { EmbeddingService } from './embedding.service';
import { SimilarityService } from './similarity.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly similarityService: SimilarityService,
  ) {}

  async search(
    documentId: number,
    question: string,
    limit = 3,
  ) {
    // 1. Generate embedding for the question
    const questionEmbedding =
      await this.embeddingService.generateEmbedding(question);

    // 2. Get chunks belonging to this document
    const chunks = await db
      .select()
      .from(documentChunks)
      .where(eq(documentChunks.documentId, documentId));

    // 3. Compare question with every chunk
    const results = chunks
      .filter((chunk) => chunk.embedding)
      .map((chunk) => {
        const chunkEmbedding = JSON.parse(
          chunk.embedding!,
        ) as number[];

        const score =
          this.similarityService.cosineSimilarity(
            questionEmbedding,
            chunkEmbedding,
          );

        return {
          chunkId: chunk.id,
          chunkIndex: chunk.chunkIndex,
          content: chunk.content,
          score,
        };
      });

    // 4. Highest similarity first
    results.sort((a, b) => b.score - a.score);

    // 5. Return top results
    return results.slice(0, limit);
  }
}