import { test, expect, APIRequestContext } from '@playwright/test';
import playwright from 'playwright';
import * as dotenv from 'dotenv';
import { Posts } from '../../Interface/post';
import { userData } from '../../dataApi/user';
dotenv.config();

const baseURL = process.env.baseURL;
const token = process.env.token;
const postData = (userId: number): Posts => ({
  user_id: userId,
  title: 'Sample Post Title',
  body: 'This is a sample post body for testing purposes.',
});

test.describe('Posts testing', () => {
  test.describe.configure({ mode: 'serial' });

  let apiContext: APIRequestContext;
  let createdUserId: number;
  let createdPostId: number;

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

  test('Get all posts', async () => {
    const response = await apiContext.get(`${baseURL}/public/v2/posts`);
    expect(response.status()).toBe(200);
  });

  test('Create a new post', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/posts`, {
      data: postData(createdUserId), // ✅ user_id set at runtime
    });
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    createdPostId = responseBody.id;
  });

  test('Get post by user id', async () => {
    const response = await apiContext.get(
      `${baseURL}/public/v2/users/${createdUserId}/posts`
    );
    expect(response.status()).toBe(200);
  });

  test('Create post with invalid user id', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/posts`, {
      data: postData(999999), // ✅ pass invalid id via function, not mutation
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
    console.log('Error message:\n', responseBody);
  });

  test('Create post with missing title', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/posts`, {
      data: {
        user_id: createdUserId,
        body: 'This post has no title.',
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
    console.log('Error message:\n', responseBody);
  });

  test('Create post with missing body', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/posts`, {
      data: {
        user_id: createdUserId,
        title: 'This post has no body.',
      },
    });
    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'body',
          message: "can't be blank",
        }),
      ])
    );
    console.log('Error message:\n', responseBody);
  });
}); //end of describe block