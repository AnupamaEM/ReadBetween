import { Body, Controller, Post,Get,Param } from '@nestjs/common';
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
}