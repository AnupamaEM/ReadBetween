import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from '../documents/documents.module';
import { IngestionModule } from '../ingestion/ingestion.module';

@Module({
  imports: [DocumentsModule,IngestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
