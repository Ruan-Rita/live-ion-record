import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { HashService } from './hash.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashService],
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig],
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [HashService],
})
export class AuthModule {}
