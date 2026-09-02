import { Injectable,NotFoundException } from '@nestjs/common';
import { db } from '../database/database';
import {documents,documentChunks} from '../database/schema';
import { IngestDocumentDto } from './dtos/upload_doc.dto';
import { eq } from 'drizzle-orm';
import { ChunkingService } from '../ingestion/chunking.service';
import { EmbeddingService } from '../ai/embedding.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingService,
  ) {}
  async ingest(dto: IngestDocumentDto) {
    const insertResult = db
      .insert(documents)
      .values({
        title: dto.title,
        sourceType: dto.type,
        sourceUrl: dto.url ?? null,
        rawContent: dto.content ?? '',
        status: 'PROCESSING',
      })
      .run();

    const documentId = Number(insertResult.lastInsertRowid);

    const chunks = this.chunkingService.chunkText(
      dto.content ?? '',
    );

    let chunksWithEmbeddings: Array<{
      documentId: number;
      chunkIndex: number;
      content: string;
      embedding: string;
    }> = [];

    try {
      chunksWithEmbeddings = await Promise.all(
        chunks.map(async (chunk) => {
          const embedding =
            await this.embeddingService.generateEmbedding(
              chunk.content,
            );

          return {
            documentId,
            chunkIndex: chunk.index,
            content: chunk.content,
            embedding: JSON.stringify(embedding),
          };
        }),
      );
    } catch (error) {
      db.update(documents)
        .set({
          status: 'FAILED',
          updatedAt: new Date().toISOString(),
        })
        .where(eq(documents.id, documentId))
        .run();

      throw error;
    }

    if (chunksWithEmbeddings.length > 0) {
      db.insert(documentChunks)
        .values(chunksWithEmbeddings)
        .run();
    }

    const updatedDocument = db
      .update(documents)
      .set({
        status: 'COMPLETED',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(documents.id, documentId))
      .returning()
      .get();

    return {
      document: updatedDocument,
      chunks: chunksWithEmbeddings,
    };
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
    throw new NotFoundException(
      `Document with ID ${id} not found`,
    );
  }

  const chunks = await db
    .select({
      id: documentChunks.id,
      chunkIndex: documentChunks.chunkIndex,
      content: documentChunks.content,
      embedding: documentChunks.embedding,
    })
    .from(documentChunks)
    .where(eq(documentChunks.documentId, id));

  return {
    ...document,
    chunks,
  };
}
}