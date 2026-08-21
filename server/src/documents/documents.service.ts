import { Injectable,NotFoundException } from '@nestjs/common';
import { db } from '../database/database';
import { documents } from '../database/schema';
import { IngestDocumentDto } from './dtos/upload_doc.dto';
import { eq } from 'drizzle-orm';
import { ChunkingService } from '../ingestion/chunking.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly chunkingService: ChunkingService) {}
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
      const chunks = this.chunkingService.chunkText(
    dto.content ?? '',
  );

    return { document, chunks };
  }

  async findAll() {
    return db
      .select({
        id: documents.id,
        title: documents.title,
        sourceType: documents.sourceType,
        sourceUrl: documents.sourceUrl,
        status: documents.status,
        createdAt: documents.createdAt,
      })
      .from(documents);
  }

  async findOne(id: number) {
  const [document] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .limit(1);

  if (!document) {
    throw new NotFoundException(`Document with ID ${id} not found`);
  }

  return document;
}
}