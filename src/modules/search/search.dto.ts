import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class SearchDto {
  @IsString()
  q: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}