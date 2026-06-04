import { test, expect, APIRequestContext } from '@playwright/test';
import playwright from 'playwright';
import * as dotenv from 'dotenv';
import { User } from '../../Interface/user';
import { Posts } from '../../Interface/post';
import { Comments } from '../../Interface/comments';
dotenv.config();

const baseURL = process.env.baseURL;
const token = process.env.token;

const userData: User = {
  name: Math.random().toString(36).substring(2, 15),
  email: Math.random().toString(36).substring(2, 15) + '@example.com',
  gender: 'male',
  status: 'active',
};

const postData = (userId: number): Posts => ({
  user_id: userId,
  title: 'Sample Post Title',
  body: 'This is a sample post body for testing purposes.',
});

const commentData = (postId: number, name?: string, email?: string): Partial<Comments> => ({
  post_id: postId,
  name: name,
  email: email,
  body: 'This is a sample comment body for testing purposes.',
});

test.describe('Comments testing', () => {
  test.describe.configure({ mode: 'serial' });

  let apiContext: APIRequestContext;
  let createdUserId: number;
  let createdUserName: string;
  let createdUserEmail: string;
  let createdPostId: number;
  let createdCommentId: number;

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
    createdUserName = user.name;
    createdUserEmail = user.email;

    const postResponse = await apiContext.post(`${baseURL}/public/v2/posts`, {
      data: postData(createdUserId),
    });
    const post = await postResponse.json();
    createdPostId = post.id;
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('Get all comments', async () => {
    const response = await apiContext.get(`${baseURL}/public/v2/comments`);
    expect(response.status()).toBe(200);
  });

  test('Create a new comment', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/comments`, {
      data: commentData(createdPostId, createdUserName, createdUserEmail),
    });
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    createdCommentId = responseBody.id;
  });

  test('Get comments by post id', async () => {
    const response = await apiContext.get(
      `${baseURL}/public/v2/posts/${createdPostId}/comments`
    );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.length).toBeGreaterThan(0);
    expect(responseBody.some((c: { id: number }) => c.id === createdCommentId)).toBe(true);
  });

  test('Create a comment with missing fields', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/comments`, {
      data: commentData(createdPostId),
    });
    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'name',
          message: "can't be blank",
        }),
        expect.objectContaining({
          field: 'email',
          message: "can't be blank, is invalid",
        }),
      ])
    );
    console.log('Error messages:\n', responseBody);
  });

  test('Create a comment with invalid post id', async () => {
    const response = await apiContext.post(`${baseURL}/public/v2/comments`, {
      data: commentData(999999, createdUserName, createdUserEmail),
    });
    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'post',
          message: 'must exist',
        }),
      ])
    );
    console.log('Error message:\n', responseBody);
  });

  test('Get comments with invalid post id', async () => {
    const response = await apiContext.get(
      `${baseURL}/public/v2/posts/999999/comments`
    );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual([]);
  });
}); //end of describe block