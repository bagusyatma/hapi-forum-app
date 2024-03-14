const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('Comments endpoints', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'content',
      };
      const server = await createServer(container);

      /* add user to get access token */
      const { accessToken, userId } = await ServerTestHelper.getCredential({ server });

      /* add thread to get thread id */
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);

      /* add user to get access token */
      const { accessToken, userId } = await ServerTestHelper.getCredential({ server });

      /* add thread to get thread id */
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = { content: 123 };
      const server = await createServer(container);

      /* add user to get access token */
      const { accessToken, userId } = await ServerTestHelper.getCredential({ server });

      /* add thread to get thread id */
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment', async () => {
      // Arrange
      const server = await createServer(container);

      /* add user to get access token */
      const { accessToken, userId } = await ServerTestHelper.getCredential({ server });

      /* add thread to get thread id */
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      /* add comment to get comment id */
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, threadId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when user not the owner of the comment', async () => {
      // Arrange
      const server = await createServer(container);

      /* add first user to get access token */
      const { accessToken: firstAccessToken, userId: firstUserId } = await ServerTestHelper.getCredential({ server, username: 'dicoding' });

      /* add thread to get thread id */
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: firstUserId });

      /* add comment to get comment id */
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: firstUserId, threadId });

      /* add second user to get access token */
      const { accessToken: secondAccessToken } = await ServerTestHelper.getCredential({ server, username: 'bagusyatma'});

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${secondAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda bukan pemilik komentar ini');
    });
  });
});
