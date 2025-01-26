import { Injectable, Inject } from '@nestjs/common';
import { StorageStrategy } from './interfaces/storage.interface';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_STRATEGY') private storageStrategy: StorageStrategy,
  ) {}

  upload(file: Express.Multer.File, options?: any): Promise<string> {
    return this.storageStrategy.upload(file, options);
  }

  delete(filePath: string): Promise<void> {
    return this.storageStrategy.delete(filePath);
  }
}
