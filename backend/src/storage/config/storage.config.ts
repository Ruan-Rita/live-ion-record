import { registerAs } from '@nestjs/config';

type StorageConfig = {
  driver: StorageType;
};

type StorageType = 'AWS_BUCKET' | 'LOCAL';

export default registerAs(
  'storageConfig',
  (): StorageConfig => ({
    driver: (process.env.STORAGE_DRIVER as StorageType) || 'LOCAL',
  }),
);
