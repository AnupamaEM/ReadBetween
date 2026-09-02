import { Module } from '@nestjs/common';

import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

import { IngestionModule } from '../ingestion/ingestion.module';
import { AiModule } from '../ai/ai.module';

import { QueryService } from './query.service';

@Module({
  imports: [IngestionModule, AiModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, QueryService],
})
export class DocumentsModule {}