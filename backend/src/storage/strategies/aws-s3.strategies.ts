import { StorageStrategy } from '../interfaces/storage.interface';
import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import awsBucketConfig from '../config/aws-bucket.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AwsS3Strategy implements StorageStrategy {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  constructor(
    @Inject(awsBucketConfig) configAws: ConfigType<typeof awsBucketConfig>,
  ) {
    this.s3 = new AWS.S3({ ...configAws });
    this.bucketName = configAws.bucketName;
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: file.originalname,
      Body: file.buffer,
    };

    const result = await this.s3.upload(params).promise();
    return result.Location; // URL of the uploaded file
  }

  async delete(filePath: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: filePath,
    };

    await this.s3.deleteObject(params).promise();
  }
}
