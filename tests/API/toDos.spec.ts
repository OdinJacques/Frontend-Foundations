import { test, expect, APIRequestContext } from '@playwright/test';
import playwright from 'playwright';
import * as dotenv from 'dotenv';
import { User } from '../../Interface/user';
import { ToDo } from '../../Interface/toDos';
dotenv.config();

const baseURL = process.env.baseURL;
const token = process.env.token;

const userData: User = {
  name: Math.random().toString(36).substring(2, 15),
  email: Math.random().toString(36).substring(2, 15) + '@example.com',
  gender: 'male',
  status: 'active',
};

const toDoData = (userId: number): ToDo => ({
  user_id: userId,
  title: 'Sample ToDo Title',
  due_on: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'pending',
});

test.describe('ToDos testing', () => {
  test.describe.configure({ mode: 'serial' });

  let apiContext: APIRequestContext;
  let createdUserId: number;
  let createdToDoId: number;

  test.beforeAll(async () => {
    apiContext = await playwright.request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userResponse = await apiContext.post(`${baseURL}/public/v2/users`, {
      data: userData,
    });
    const user = await userResponse.json();
    createdUserId = user.id;
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('Get all ToDos', async () => {
    const response = await apiContext.get(`${baseURL}/public/v2/todos`);
    expect(response.status()).toBe(200);
  });

  test('Create a new ToDo', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/todos`, {
      data: toDoData(createdUserId),
    });
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    createdToDoId = responseBody.id;
  });

  test('Get ToDo by user id', async () => {
    const response = await apiContext.get(
      `${baseURL}/public/v2/users/${createdUserId}/todos`
    );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.length).toBeGreaterThan(0);
    expect(responseBody.some((t: { id: number }) => t.id === createdToDoId)).toBe(true);
  });

  test('Create ToDo with invalid user id', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/todos`, {
      data: toDoData(999999),
    });
    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'user',
          message: 'must exist',
        }),
      ])
    );
  });

  test('Get ToDo with invalid ToDo id', async () => {
    const response = await apiContext.get(`${baseURL}/public/v2/todos/999999`);
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: 'Resource not found',
      })
    );
  });

  test('Create ToDo with missing title', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/todos`, {
      data: {
        user_id: createdUserId,
        due_on: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      },
    });
    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'title',
          message: "can't be blank",
        }),
      ])
    );
  });
}); //end of describe block