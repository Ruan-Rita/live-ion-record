import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RecordModule } from './record/record.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [],
      synchronize:
        !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
      autoLoadEntities:
        !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
    }),
    UserModule,
    AuthModule,
    RecordModule,
    StorageModule,
  ],
  providers: [],
})
export class AppModule {}
