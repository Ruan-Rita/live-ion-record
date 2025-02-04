import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { UpdateRecordDto } from './dto/update-record.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';
import { Public } from 'src/auth/constant';

@Controller('record')
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
    private readonly storageService: StorageService,
  ) {}

  @Public()
  @Post('/upload-chunks')
  @UseInterceptors(FileInterceptor('chunk'))
  async uploadRecordChunks(
    @UploadedFile() file: Express.Multer.File,
    @Body('filename') filename: string,
    @Body('index') index: string,
  ) {
    const fileFolder = filename;
    const fileName = `chunk${index}.webm`;

    await this.storageService.temporary(file, {
      fileName,
      path: fileFolder,
    });

    return { success: true, message: 'Chunk uploaded successfully' };
  }

  @Public()
  @Post('complete')
  async completeUpload(@Body('filename') filename: string) {
    return await this.storageService.uploadStream(filename);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.storageService.upload(file);
    return { url: fileUrl };
  }

  @Get()
  findAll() {
    return this.recordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordService.remove(+id);
  }
}
