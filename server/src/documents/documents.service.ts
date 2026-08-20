import { Injectable } from '@nestjs/common';
import { db } from '../database/database';
import { documents } from '../database/schema';
import { IngestDocumentDto } from './dtos/upload_doc.dto';

@Injectable()
export class DocumentsService {
  async ingest(dto: IngestDocumentDto) {
    const [document] = await db
      .insert(documents)
      .values({
        title: dto.title,
        sourceType: dto.type,
        sourceUrl: dto.url ?? null,
        rawContent: dto.content ?? '',
        status: 'COMPLETED',
      })
      .returning();

    return document;
  }
}