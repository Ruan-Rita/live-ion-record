import { UploadOptions } from './upload-options.interface';

export interface StorageStrategy {
  upload(file: Express.Multer.File, options?: UploadOptions): Promise<string>;
  delete(filePath: string): Promise<void>;
}
