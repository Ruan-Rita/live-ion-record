import { INestApplication } from '@nestjs/common';
import { initTestingModule, resetGlobalApp } from './helper.test';
import { StorageStrategy } from 'src/storage/interfaces/storage.interface';
import { promises as fs } from 'fs';

describe('Storage Module (e2e)', () => {
  let app: INestApplication;
  let storageService: StorageStrategy;

  beforeAll(async () => {
    const { appInitialized, moduleFixture } = await initTestingModule();
    app = appInitialized;

    storageService = moduleFixture.get<StorageStrategy>('STORAGE_STRATEGY');

    await app.init();
  });

  afterAll(() => {
    resetGlobalApp();
  });

  it('should save file in upload folder', async () => {
    const fileMocked: Express.Multer.File = {
      originalname: 'test.txt',
      buffer: Buffer.from('test content'),
    } as Express.Multer.File;

    await storageService.upload(fileMocked);

    const file = await fs.readFile('./uploads/test.txt');

    expect(file).toBeInstanceOf(Buffer);
  });
});
