import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { IngestDocumentDto } from './dtos/upload_doc.dto';
import { EmbeddingService } from '../ai/embedding.service';

@Controller()
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  @Post('ingest')
  async ingest(@Body() dto: IngestDocumentDto) {
    return this.documentsService.ingest(dto);
  }

  @Get('items/:id')
  async findOne(@Param('id') id: string) {
    return this.documentsService.findOne(Number(id));
  }

  @Get('items')
  async findAll() {
    const items = await this.documentsService.findAll();

    return {
      items,
    };
  }

  @Post('test-embedding')
  async testEmbedding(@Body() body?: { text?: string }) {
    const text = body?.text;

    if (typeof text !== 'string' || !text.trim()) {
      throw new BadRequestException(
        'Request body must include a non-empty "text" field.',
      );
    }

    const embedding = await this.embeddingService.generateEmbedding(text);

    return {
      dimensions: embedding.length,
      embedding,
    };
  }
}