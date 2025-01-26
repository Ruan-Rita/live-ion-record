import { StorageStrategy } from '../interfaces/storage.interface';
import { Inject, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import localStorageConfig from '../config/local-storage.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class LocalStorageStrategy implements StorageStrategy {
  private readonly disk: string;
  constructor(
    @Inject(localStorageConfig.KEY)
    configStorage: ConfigType<typeof localStorageConfig>,
  ) {
    this.disk = path.join(__dirname, '../../../' + configStorage.disk); // default
  }

  async upload(file: Express.Multer.File): Promise<string> {
    try {
      const filePath = path.join(this.disk, file.originalname);

      // Ensure upload directory exists
      await fs.mkdir(this.disk, { recursive: true });

      // Save the file
      await fs.writeFile(filePath, file.buffer);

      return filePath;
    } catch (e) {
      console.log('errr', e);
    }
  }

  async delete(filePath: string): Promise<void> {
    await fs.unlink(filePath);
  }
}
