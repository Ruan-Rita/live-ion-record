import { registerAs } from '@nestjs/config';

export default registerAs('localStorageConfig', () => ({
  disk: 'uploads',
}));
