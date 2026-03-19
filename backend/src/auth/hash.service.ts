import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hash(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  async compare(password: string, passwordHash: string) {
    const isMatch = await bcrypt.compare(password, passwordHash);
    return isMatch;
  }
}
