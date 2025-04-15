import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { StorageModule } from 'src/storage/storage.module';
import { Record } from './entities/record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  controllers: [RecordController],
  providers: [RecordService],
  imports: [StorageModule, TypeOrmModule.forFeature([Record, User])],
  exports: [RecordService, TypeOrmModule],
})
export class RecordModule {}
