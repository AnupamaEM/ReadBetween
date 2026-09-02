import { IsInt, IsString, Min } from 'class-validator';

export class QueryDto {
  @IsInt()
  @Min(1)
  documentId!: number;

  @IsString()
  question!: string;
}