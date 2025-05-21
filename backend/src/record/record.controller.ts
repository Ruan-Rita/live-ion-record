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
  Req,
  NotFoundException,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { UpdateRecordDto } from './dto/update-record.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';
import { Public } from 'src/auth/constant';
import { log } from 'console';
import { AuthenticatedRequest } from 'src/auth/interface/authenticate-request.type';

@Controller('record')
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
    private readonly storageService: StorageService,
  ) {}

  @Post('/upload-chunks')
  @UseInterceptors(FileInterceptor('chunk'))
  async uploadRecordChunks(
    @UploadedFile() file: Express.Multer.File,
    @Body('filename') filename: string,
    @Body('index') index: string,
    @Body('token') token: string,
    @Req() request: AuthenticatedRequest
  ) {
    const user = request.user;
    console.log('Chegando chunks');
    
    await this.recordService.createOrUpdate({
      filename,
      index: +index,
      file,
      userId: user.id,
      token: token,
    });

    return { success: true, message: 'Chunk uploaded successfully' };
  }

  @Post('complete')
  async completeUpload(
    @Body('filename') filename: string, 
    @Body('token') token: string,
    @Req() request: AuthenticatedRequest
  ) {
    console.log('complete videos');
    const user = request.user;
    const result = await this.storageService.uploadStream(filename);

    if (result.success) {
      const record = await this.recordService.findOne(token, user.id);

      if (record) {
        await this.recordService.update(record.id, {
          filePath: result.path,
        });

        console.log('complete videos uploaded');

        return { success: true, message: 'Record uploaded successfully' };
      }
      
      return { success: false, message: 'Failed to upload record' };
    }
    
    return { success: false, message: 'Failed to upload record' };
  }

  @Get('list')
  async listRecords(@Req() request: AuthenticatedRequest) {
    const user = request.user;
    const results = await this.recordService.findAll(user.id);
    
    return results.map(result => ({
      ...result,
      url: `${process.env.APP_URL}/uploads/videosRaw/${result.filePath}`,
    }));
  }

  @Get(':token')
  async getRecord(@Param('token') token: string, @Req() request: AuthenticatedRequest) {
    const user = request.user;
    const result = await this.recordService.findOne(token, user.id);
    if (!result) {
      throw new NotFoundException('Record not found');
    }
    return {
      ...result,
      url: `${process.env.APP_URL}/uploads/videosRaw/${result.filePath}`,
    };
  }
}
