import { LocalStorageStrategy } from './local-storage.strategies';
import { promises as fs } from 'fs';
import * as path from 'path';

jest.mock('fs/promises'); // Mock Node's fs module

describe('LocalStorageStrategy', () => {
  let strategy: LocalStorageStrategy;

  beforeEach(() => {
    jest.clearAllMocks();
    strategy = new LocalStorageStrategy({
      disk: 'uploads', // Mocked configuration
    });
  });

  describe('constructor', () => {
    it('should set the disk path correctly', () => {
      const expectedPath = path.join(__dirname, '../../../uploads');
      expect(strategy['disk']).toBe(expectedPath);
    });
  });

  describe('upload', () => {
    it('should upload the file and return the file path', async () => {
      const mockFile: Express.Multer.File = {
        originalname: 'test.txt',
        buffer: Buffer.from('test content'),
      } as Express.Multer.File;

      const mockDiskPath = path.join(__dirname, '../../../uploads');
      const mockFilePath = path.join(mockDiskPath, mockFile.originalname);

      // Mock fs.promises.mkdir and fs.promises.writeFile
      jest.spyOn(fs, 'mkdir').mockResolvedValue(undefined);
      jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);

      // Call the method
      const result = await strategy.upload(mockFile);

      // Check mkdir was called with correct arguments
      expect(fs.mkdir).toHaveBeenCalledTimes(1);
      expect(fs.mkdir).toHaveBeenCalledWith(mockDiskPath, {
        recursive: true,
      });

      // Check writeFile was called with correct arguments
      expect(fs.writeFile).toHaveBeenCalledTimes(1);
      expect(fs.writeFile).toHaveBeenCalledWith(mockFilePath, mockFile.buffer);

      // Ensure the result matches the expected path
      expect(result).toBe(mockFilePath);
    });
  });

  describe('delete', () => {
    it('should delete the specified file', async () => {
      const mockFilePath = path.join(__dirname, '../../../uploads/test.txt');

      jest.spyOn(fs, 'unlink').mockResolvedValue(undefined);

      await strategy.delete(mockFilePath);

      expect(fs.unlink).toHaveBeenCalledWith(mockFilePath);
    });

    it('should throw an error if the file does not exist', async () => {
      const mockFilePath = path.join(
        __dirname,
        '../../../uploads/nonexistent.txt',
      );

      jest.spyOn(fs, 'unlink').mockRejectedValue(new Error('File not found'));

      await expect(strategy.delete(mockFilePath)).rejects.toThrow(
        'File not found',
      );
      expect(fs.unlink).toHaveBeenCalledWith(mockFilePath);
    });
  });
});
