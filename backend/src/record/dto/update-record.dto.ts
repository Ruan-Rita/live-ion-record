import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRecordDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  filePath?: string;

  @IsOptional()
  @IsString()
  thumbnailPath?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;
}
