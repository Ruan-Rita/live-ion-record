import * as request from 'supertest';
import { SigninAuthDto } from 'src/auth/dto/signin-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { RecordModule } from 'src/record/record.module';
import { StorageModule } from 'src/storage/storage.module';

export function getUserData() {
  const userData: CreateUserDto = {
    name: 'ruan rita',
    email: 'ruan@gmail.com',
    password: 'password',
  };
  return userData;
}

export async function createUser(app: INestApplication) {
  const result = await request(app.getHttpServer())
    .post('/user')
    .send(getUserData())
    .expect(201);

  return result.body;
}

export async function createUserAuthenticated(app: INestApplication) {
  await createUser(app);
  const login: SigninAuthDto = {
    email: getUserData().email,
    password: getUserData().password,
  };

  const result = await request(app.getHttpServer())
    .post('/auth')
    .send(login)
    .expect(201);

  return result.body;
}

// export
export async function initTestingModule() {
  if (!global.testApp || !global.testModule) {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_TEST_HOST,
          port: Number(process.env.DB_TEST_PORT),
          username: process.env.DB_TEST_USERNAME,
          password: process.env.DB_TEST_PASSWORD,
          database: process.env.DB_TEST_DATABASE,
          entities: [],
          synchronize: true,
          autoLoadEntities: true,
          dropSchema: true,
        }),
        UserModule,
        AuthModule,
        RecordModule,
        StorageModule,
      ],
    }).compile();

    const appInitialized = moduleFixture.createNestApplication();
    appInitialized.enableCors();
    appInitialized.useGlobalPipes(
      new ValidationPipe({
        transform: true, // Converte automaticamente o payload para uma instância do DTO
        whitelist: true, // Remove campos não declarados no DTO
        forbidNonWhitelisted: true, // Rejeita payload com campos não permitidos
        enableDebugMessages: true,
      }),
    );

    global.testApp = appInitialized; // Save globally
    global.testModule = moduleFixture; // Save globally
  }

  return {
    moduleFixture: global.testModule as TestingModule,
    appInitialized: global.testApp as INestApplication,
  };
}

export function resetGlobalApp() {
  global.testApp = undefined;
  global.testModule = undefined;
}
