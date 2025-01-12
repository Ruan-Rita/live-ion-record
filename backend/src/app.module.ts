import { Module } from '@nestjs/common';
import { LibraryModule } from './library/library.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RecordModule } from './record/record.module';
@Module({
  imports: [LibraryModule, UserModule, AuthModule, ConfigModule.forRoot(), RecordModule],
  providers: [],
})
export class AppModule {}
