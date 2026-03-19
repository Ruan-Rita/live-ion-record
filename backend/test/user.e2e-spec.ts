import { INestApplication } from '@nestjs/common';
import { HashService } from 'src/auth/hash.service';
import * as request from 'supertest';

import {
  createUser,
  createUserAuthenticated,
  getUserData,
  initTestingModule,
  resetGlobalApp,
} from './helper.test';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let hashService: HashService;

  beforeEach(async () => {
    const { moduleFixture, appInitialized } = await initTestingModule();
    app = appInitialized;
    hashService = moduleFixture.get<HashService>(HashService);
    await app.init();
  });

  afterAll(() => {
    resetGlobalApp();
  });

  describe('User CRUD', () => {
    describe('User [POST]', () => {
      it('should create a new user', async () => {
        const result = await createUser(app);

        expect(result).toMatchObject({
          data: {
            name: getUserData().name,
            email: getUserData().email,
          },
          message: 'User created successfully',
        });

        expect(
          await hashService.compare(
            getUserData().password,
            result.data.password,
          ),
        ).toBeTruthy();
      });
    });

    describe('User basic info', () => {
      it('should take basic info about user logged', async () => {
        const { accessToken } = await createUserAuthenticated(app);

        const userInfo = await request(app.getHttpServer())
          .get('/user/basic-info')
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          .expect(200);

        expect(userInfo.body).toMatchObject({
          id: expect.any(Number),
          name: getUserData().name,
          email: getUserData().email,
          emailVerified: false,
          isActive: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
        });
      });
    });
  });

  describe('Auth Service', () => {
    describe('SignIn [POST]', () => {
      it('should sign in using user credentials', async () => {
        const result = await createUserAuthenticated(app);

        expect(result).toHaveProperty('accessToken');
        expect(typeof result.accessToken).toBe('string');
        expect(result.accessToken).not.toBe('');
      });
    });
  });
});
