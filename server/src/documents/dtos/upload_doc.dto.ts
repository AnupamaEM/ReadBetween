import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class IngestDocumentDto {
  @IsString()
  @IsNotEmpty()
  type !: 'TEXT' | 'URL';

  @IsString()
  @IsNotEmpty()
  title !: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUrl()
  url?: string;
}