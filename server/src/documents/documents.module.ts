import { Module } from '@nestjs/common';

import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

import { IngestionModule } from '../ingestion/ingestion.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [IngestionModule, AiModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}