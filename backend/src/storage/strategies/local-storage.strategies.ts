import { StorageStrategy } from '../interfaces/storage.interface';
import { Inject, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import localStorageConfig from '../config/local-storage.config';
import { ConfigType } from '@nestjs/config';
import { UploadOptions } from '../interfaces/upload-options.interface';

@Injectable()
export class LocalStorageStrategy implements StorageStrategy {
  readonly disk: string;

  constructor(
    @Inject(localStorageConfig.KEY)
    configStorage: ConfigType<typeof localStorageConfig>,
  ) {
    this.disk = path.join(__dirname, '../../../' + configStorage.disk);
  }

  async upload(
    file: Express.Multer.File,
    options?: UploadOptions,
  ): Promise<string> {
    try {
      const fullPath = path.join(this.disk, options?.path ?? '');
      const filePath = path.join(fullPath, options?.fileName ?? '');

      // Ensure upload directory exists
      await fs.mkdir(fullPath, { recursive: true });

      // Save the file
      await fs.writeFile(filePath, file.buffer);

      return filePath;
    } catch (e) {
      console.log('errr', e);
    }
  }

  async temporary(file: Express.Multer.File, options?: UploadOptions) {
    const newOptions: UploadOptions = {
      ...options,
      path: '/temporary',
    };

    if (options.path) {
      const isSlice = options.path.substring(0, 1) === '/';
      newOptions.path += `${isSlice ? '' : '/'}${options.path}`;
    }

    return await this.upload(file, newOptions);
  }

  async delete(filePath: string): Promise<void> {
    await fs.unlink(filePath);
  }

  async clearTemporary(pathFiles: string) {
    const temporaryPath = '/temporary';
    const finalPath = path.join(this.disk, temporaryPath, pathFiles);

    await fs.rm(finalPath, { recursive: true, force: true });
  }
}
