import { test, expect, APIRequestContext } from '@playwright/test';
import playwright from 'playwright';
import * as dotenv from 'dotenv';
import { User } from '../../Interface/user';
dotenv.config();

const baseURL = process.env.baseURL;
const token = process.env.token;

test.describe('User API Tests', () => {
  test.describe.configure({ mode: 'serial' });

  let apiContext: APIRequestContext;
  let firstUserId: number;
  let createdUserId: number;
  const UserData: User = {
    name: Math.random().toString(36).substring(2, 15),
    email: Math.random().toString(36).substring(2, 15) + '@example.com',
    gender: 'Male',
    status: 'Active',
  };

  test.beforeAll(async () => {
    apiContext = await playwright.request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('Get User Details', async () => {
    const response = await apiContext.get(`${baseURL}/public/v2/users`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    firstUserId = responseBody[0].id;
  });

  test('Get User by ID', async () => {
    expect(
      firstUserId,
      'firstUserId is undefined — Get User Details test may have failed'
    ).toBeDefined();
    const response = await apiContext.get(
      `${baseURL}/public/v2/users/${firstUserId}`
    );
    expect(response.status()).toBe(200);
  });

  test('Create a New User', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/users`, {
      data: UserData,
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    createdUserId = body.id;
  });

  test('Get user by ID after creation', async () => {
    expect(
      createdUserId,
      'createdUserId is undefined — Create User test may have failed'
    ).toBeDefined();
    const response = await apiContext.get(
      `${baseURL}/public/v2/users/${createdUserId}`
    );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(createdUserId);
  });

  test('Update all user details', async () => {
    expect(
      createdUserId,
      'createdUserId is undefined — Create User test may have failed'
    ).toBeDefined();
    const response = await apiContext.put(
      `${baseURL}/public/v2/users/${createdUserId}`,
      {
        data: {
          name: 'Updated Name',
          email: 'updated@example.com',
          gender: 'female',
          status: 'inactive',
        },
      }
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('Updated Name');
    expect(body.email).toBe('updated@example.com');
    expect(body.gender).toBe('female');
    expect(body.status).toBe('inactive');
  });

  test('Update email of user', async () => {
    expect(
      createdUserId,
      'createdUserId is undefined — Create User test may have failed'
    ).toBeDefined();
    const response = await apiContext.patch(
      `${baseURL}/public/v2/users/${createdUserId}`,
      {
        data: {
          email: 'patched@example.com',
        },
      }
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.email).toBe('patched@example.com');
  });

  test('Delete user', async () => {
    expect(
      createdUserId,
      'createdUserId is undefined — Create User test may have failed'
    ).toBeDefined();
    const response = await apiContext.delete(
      `${baseURL}/public/v2/users/${createdUserId}`
    );
    expect(response.status()).toBe(204);
  });

  test('Verify user no longer exists after deletion', async () => {
    expect(
      createdUserId,
      'createdUserId is undefined — Delete User test may have failed'
    ).toBeDefined();
    const response = await apiContext.get(
      `${baseURL}/public/v2/users/${createdUserId}`
    );
    expect(response.status()).toBe(404);
  });

  test('Try to create a user without any data', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/users`, {
      data: {},
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email', message: "can't be blank" }),
        expect.objectContaining({ field: 'name', message: "can't be blank" }),
        expect.objectContaining({
          field: 'gender',
          message: "can't be blank, can be male of female",
        }),
        expect.objectContaining({ field: 'status', message: "can't be blank" }),
      ])
    );
  });

  test('Try to create a user with invalid email', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/users`, {
      data: {
        name: 'Test User',
        email: 'invalid-email',
        gender: 'male',
        status: 'active',
      },
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email', message: 'is invalid' }),
      ])
    );
  });

  test('Try to create a user with invalid gender', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/users`, {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        gender: 'invalid-gender',
        status: 'active',
      },
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'gender',
          message: "can't be blank, can be male of female",
        }),
      ])
    );
  });

  test('Try to create a user with invalid status', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/users`, {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        gender: 'male',
        status: 'invalid-status',
      },
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'status', message: "can't be blank" }),
      ])
    );
  });
}); //end of describe block
