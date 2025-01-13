import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('User CRUD', () => {
    it('test', () => {
      expect(10 + 20).toBe(30);
    });
    // it('should create a new user', async () => {
    //   const userData: CreateUserDto = {
    //     name: 'ruan rita',
    //     email: 'ruan@gmail.com',
    //     password: 'password',
    //   };
    //   const result = await request(app.getHttpServer())
    //     .post('/')
    //     .send({})
    //     .expect(200);
    // });
  });
});
