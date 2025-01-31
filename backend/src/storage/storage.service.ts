import { Injectable, Inject } from '@nestjs/common';
import { StorageStrategy } from './interfaces/storage.interface';
import { LocalStorageStrategy } from './strategies/local-storage.strategies';
import { UploadOptions } from './interfaces/upload-options.interface';

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
    // // Check if the temp directory exists

    // if (!fs.existsSync(tempDir/fileName)) {
    //   return { success: false, message: 'No chunks found' };
    // }

    // // Read and concatenate all chunks in order
    // const chunkFiles = fs
    //   .readdirSync(tempDir)
    //   .sort((a, b) => parseInt(a) - parseInt(b));

    // const writeStream = fs.createWriteStream(outputFile);

    // for (const chunkFile of chunkFiles) {
    //   const chunkPath = path.join(tempDir, chunkFile);
    //   const chunkData = fs.readFileSync(chunkPath);
    //   writeStream.write(chunkData);
    // }

    // writeStream.end();

    // // Cleanup: Remove temporary chunks
    // fs.rmSync(tempDir, { recursive: true, force: true });
    const outputFile = await this.upload(Buffer.bind(132));
    this.clearTemporary(fileName);

    return {
      success: true,
      message: 'File uploaded successfully',
      path: outputFile,
    };
  }
}
