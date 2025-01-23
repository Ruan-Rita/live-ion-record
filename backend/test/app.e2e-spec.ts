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
import { HashService } from 'src/auth/hash.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let hashService: HashService;

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
      providers: [HashService],
    }).compile();

    app = moduleFixture.createNestApplication();
    hashService = moduleFixture.get<HashService>(HashService);
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

        expect(result.body).toMatchObject({
          data: {
            name: userData.name,
            email: userData.email,
          },
          message: 'User created successfully',
        });

        expect(
          await hashService.compare(userData.password, result.body.data.password),
        ).toBeTruthy();
      });
    });
  });

  describe('Auth Service', () => {
    describe('SignIn [POST]', () => {
      it('should sign in using user credentials', async () => {
        const userData: CreateUserDto = {
          name: 'ruan rita',
          email: 'ruan@gmail.com',
          password: 'password',
        };

        await request(app.getHttpServer())
          .post('/user')
          .send(userData)
          .expect(201);

        const login: SigninAuthDto = {
          email: userData.email,
          password: userData.password,
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
