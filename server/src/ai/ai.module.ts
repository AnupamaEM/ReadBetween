import { Module } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { LlmService } from './llm.service';
import { SearchService } from './search.service';
import { SimilarityService } from './similarity.service';

@Module({
  providers: [
    EmbeddingService,
    SimilarityService,
    SearchService,
    LlmService,
  ],
  exports: [
    EmbeddingService,
    SimilarityService,
    SearchService,
    LlmService,
  ],
})
export class AiModule {}