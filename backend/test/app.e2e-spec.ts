import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { RecordModule } from 'src/record/record.module';
import { SigninAuthDto } from 'src/auth/dto/signin-auth.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('User CRUD', () => {
    describe('User [POST]', () => {
      it('should create a new user', async () => {
        const userData: CreateUserDto = {
          name: 'ruan rita',
          email: 'ruan@gmail.com',
          password: 'password',
        };

        const result = await request(app.getHttpServer())
          .post('/user')
          .send(userData)
          .expect(201);

        expect(result.body).toMatchObject(userData);
      });
    });
  });

  describe('Auth Service', () => {
    describe('SignIn [POST]', () => {
      it('sign in using user data', async () => {
        const userData: CreateUserDto = {
          name: 'ruan rita',
          email: 'ruan@gmail.com',
          password: 'password',
        };

        await request(app.getHttpServer()).post('/user').send(userData);

        const login: SigninAuthDto = {
          email: 'ruan@gmail.com',
          password: 'password',
        };

        const result = await request(app.getHttpServer())
          .post('/auth')
          .send(login)
          .expect(201);

        expect(result.body).toHaveProperty('access_token');
        expect(typeof result.body.access_token).toBe('string');
        expect(result.body.access_token).not.toBe('');
      });
    });
  });
});
