import { Body, Controller, Post,Get } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { IngestDocumentDto } from './dtos/upload_doc.dto';

@Controller()
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
  ) {}

  @Post('ingest')
  async ingest(@Body() dto: IngestDocumentDto) {
    return this.documentsService.ingest(dto);
  }

  @Get('items')
  async findAll() {
    const items = await this.documentsService.findAll();

    return {
      items,
    };
  }
}