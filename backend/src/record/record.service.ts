import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { CreateOrUpdateRecordDto } from './dto/create-or-update-record.dto';
import { StorageService } from 'src/storage/storage.service';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RecordService {
  constructor(
    private readonly storageService: StorageService,
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOrUpdate(createOrUpdateRecordDto: CreateOrUpdateRecordDto) {
    const { filename, index, file, userId, token } = createOrUpdateRecordDto;
    const fileFolder = filename;

    await this.storageService.temporary(file, {
      fileName: `chunk${index}.webm`,
      path: fileFolder,
    });

    const record = await this.findOne(token, userId);
    
    if (record) {
      if (record.name !== filename) {
        return this.update(record.id, {
          name: filename,
        });
      }
      
      return record;
    }

    return this.create({
      name: filename,
      filePath: filename,
      userId,
      token,
    });
  }

  async findOne(token: string, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.recordRepository.findOne({
      where: {
        token: token,
        user: { id: userId }
      }
    });
  }

  async create(createRecordDto: CreateRecordDto) {
    const user = await this.userRepository.findOne({ where: { id: createRecordDto.userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.recordRepository.save({ ...createRecordDto, user });
  }

  update(id: number, updateRecordDto: UpdateRecordDto) {
    return this.recordRepository.update(id, updateRecordDto);
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
}
