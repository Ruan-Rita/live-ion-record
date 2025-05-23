import { Injectable, Inject } from '@nestjs/common';
import { StorageStrategy } from './interfaces/storage.interface';
import { LocalStorageStrategy } from './strategies/local-storage.strategies';
import { UploadOptions } from './interfaces/upload-options.interface';
import * as fs from 'fs';
import * as path from 'path';
import { dateNowString } from 'src/helper';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_STRATEGY') private storageStrategy: StorageStrategy,
    private readonly storageLocal: LocalStorageStrategy,
  ) {}

  upload(file: Express.Multer.File, options?: any): Promise<string> {
    return this.storageStrategy.upload(file, options);
  }

  temporary(
    file: Express.Multer.File,
    options?: UploadOptions,
  ): Promise<string> {
    return this.storageLocal.temporary(file, options);
  }

  clearTemporary(path: string) {
    return this.storageLocal.clearTemporary(path);
  }

  delete(filePath: string): Promise<void> {
    return this.storageStrategy.delete(filePath);
  }

  async uploadStream(fileName: string) {
    const temporaryDirectory = '/temporary';

    const pathToFiles = path.join(
      this.storageLocal.disk,
      temporaryDirectory,
      fileName,
    );

    const mimeType = fileName.substring(fileName.indexOf('.'), fileName.length);
    const fileNameOnly = fileName.substring(0, fileName.indexOf('.'));
    const finalName = fileNameOnly + dateNowString() + mimeType;

    const finalDirectory = path.join(this.storageLocal.disk, 'videosRaw');
    await fs.promises.mkdir(finalDirectory, { recursive: true });

    const outputFile = path.join(
      finalDirectory,
      finalName,
    );

    // Check if the temp directory exists
    if (!fs.existsSync(pathToFiles)) {
      return { success: false, message: 'No chunks found' };
    }

    // Read and concatenate all chunks in order
    const chunkFiles = fs
      .readdirSync(pathToFiles)
      .sort((a, b) => parseInt(a) - parseInt(b));

    const writeStream = fs.createWriteStream(outputFile);

    for (const chunkFile of chunkFiles) {
      const chunkPath = path.join(
        this.storageLocal.disk,
        temporaryDirectory,
        fileName,
        chunkFile,
      );

      const chunkData = fs.readFileSync(chunkPath);
      writeStream.write(chunkData);
    }

    writeStream.end();

    // Aguarda o writeStream finalizar antes de prosseguir
    await new Promise((resolve) =>
      writeStream.on('finish', () => {
        resolve(true);
      }),
    );

    // Criar um objeto semelhante ao Multer File
    const fileBuffer = fs.readFileSync(outputFile);
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: fileName,
      encoding: '7bit',
      mimetype: 'application/octet-stream', // ou use algo mais específico
      buffer: fileBuffer,
      size: fileBuffer.length,
    } as Express.Multer.File;

    await this.upload(file, { 
      path: 'videosRaw', 
      fileName: finalName 
    }); // Agora o objeto segue o formato correto

    await this.clearTemporary(fileName);
    console.log('whats final name', {finalName});
    
    return {
      success: true,
      message: 'File uploaded successfully',
      path: finalName,
    };
  }
}
