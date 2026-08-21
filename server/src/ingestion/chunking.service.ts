import { Injectable } from '@nestjs/common';

export interface DocumentChunk {
  index: number;
  content: string;
}

@Injectable()
export class ChunkingService {
  private readonly maxChunkSize = 700;
  private readonly overlapSentences = 1;

  chunkText(text: string): DocumentChunk[] {
    const sentences = this.splitIntoSentences(text);

    const chunks: DocumentChunk[] = [];

    let currentSentences: string[] = [];
    let currentLength = 0;
    let index = 0;

    for (const sentence of sentences) {
      const sentenceLength = sentence.length;

      if (
        currentLength + sentenceLength > this.maxChunkSize &&
        currentSentences.length > 0
      ) {
        chunks.push({
          index,
          content: currentSentences.join(' '),
        });

        index++;

        currentSentences =
          currentSentences.slice(-this.overlapSentences);

        currentLength = currentSentences.join(' ').length;
      }

      currentSentences.push(sentence);
      currentLength += sentenceLength;
    }

    if (currentSentences.length > 0) {
      chunks.push({
        index,
        content: currentSentences.join(' '),
      });
    }

    return chunks;
  }

  private splitIntoSentences(text: string): string[] {
    return text
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
  }
}