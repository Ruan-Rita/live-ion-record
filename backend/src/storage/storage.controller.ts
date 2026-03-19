import { Controller } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  async show() {
    return 'Your videos'; // stream videos
  }
}
