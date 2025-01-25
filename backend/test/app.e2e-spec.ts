import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
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

  const userData: CreateUserDto = {
    name: 'ruan rita',
    email: 'ruan@gmail.com',
    password: 'password',
  };

  async function createUser() {
    const result = await request(app.getHttpServer())
      .post('/user')
      .send(userData)
      .expect(201);

    return result.body;
  }

  async function createUserAuthenticated() {
    await createUser();
    const login: SigninAuthDto = {
      email: userData.email,
      password: userData.password,
    };

    const result = await request(app.getHttpServer())
      .post('/auth')
      .send(login)
      .expect(201);

    return result.body;
  }

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
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true, // Converte automaticamente o payload para uma instância do DTO
        whitelist: true, // Remove campos não declarados no DTO
        forbidNonWhitelisted: true, // Rejeita payload com campos não permitidos
        enableDebugMessages: true,
      }),
    );
    hashService = moduleFixture.get<HashService>(HashService);
    await app.init();
  });

  describe('User CRUD', () => {
    describe('User [POST]', () => {
      it('should create a new user', async () => {
        const result = await createUser();

        expect(result).toMatchObject({
          data: {
            name: userData.name,
            email: userData.email,
          },
          message: 'User created successfully',
        });

        expect(
          await hashService.compare(userData.password, result.data.password),
        ).toBeTruthy();
      });
    });
    describe('User basic info', () => {
      it('should take basic info about user logged', async () => {
        const { accessToken } = await createUserAuthenticated();

        const userInfo = await request(app.getHttpServer())
          .get('/user/basic-info')
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(200);
      });
    });
  });

  describe('Auth Service', () => {
    describe('SignIn [POST]', () => {
      it('should sign in using user credentials', async () => {
        const result = await createUserAuthenticated();

        expect(result).toHaveProperty('accessToken');
        expect(typeof result.accessToken).toBe('string');
        expect(result.accessToken).not.toBe('');
      });
    });
  });
});
