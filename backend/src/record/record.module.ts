import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [RecordController],
  providers: [RecordService],
  imports: [StorageModule],
})
export class RecordModule {}
