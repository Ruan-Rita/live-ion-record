export interface StorageStrategy {
  upload(file: Express.Multer.File, options?: any): Promise<string>;
  delete(filePath: string): Promise<void>;
}
