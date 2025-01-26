import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { LocalStorageStrategy } from './strategies/local-storage.strategies';
import { AwsS3Strategy } from './strategies/aws-s3.strategies';
import { ConfigModule, ConfigType } from '@nestjs/config';
import storageConfig from './config/storage.config';
import awsBucketConfig from './config/aws-bucket.config';
import localStorageConfig from './config/local-storage.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [storageConfig, awsBucketConfig, localStorageConfig],
    }),
  ],
  providers: [
    {
      provide: 'STORAGE_STRATEGY',
      useFactory: (
        config: ConfigType<typeof storageConfig>,
        awsConfig: ConfigType<typeof awsBucketConfig>,
        localConfig: ConfigType<typeof localStorageConfig>,
      ) => {
        const strategy = config.driver;
        if (!strategy) {
          throw new Error('Storage driver is not defined.');
        }

        return strategy === 'AWS_BUCKET'
          ? new AwsS3Strategy(awsConfig)
          : new LocalStorageStrategy(localConfig);
      },
      inject: [storageConfig.KEY, awsBucketConfig.KEY, localStorageConfig.KEY],
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
