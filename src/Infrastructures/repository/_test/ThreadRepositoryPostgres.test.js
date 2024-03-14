const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {}, {});
    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepositoryPostgres);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should persist add thread and return added thread correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });

        function fakeIdGenerator() {
          return '123'; // stub!
        }

        function fakeDateGenerator() {
          this.toISOString = () => '2021-08-08'; // stub!
        }

        const newThread = new NewThread({
          title: 'title',
          body: 'body',
          owner: 'user-123',
        });

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, fakeDateGenerator);

        // Action
        const addedThread = await threadRepositoryPostgres.addThread(newThread);

        // Assert
        const threads = await ThreadsTableTestHelper.findThreadById('thread-123');

        expect(addedThread).toStrictEqual(
          new AddedThread({
            id: 'thread-123',
            title: newThread.title,
            owner: newThread.owner,
          }),
        );

        expect(threads).toHaveLength(1);
      });
    });

    describe('getThreadById function', () => {
      it('should return NotFoundError when thread not found', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'title', body: 'body', owner: 'user-123' });

        // Action & Assert
        await expect(threadRepositoryPostgres.getThreadById('thread-999')).rejects.toThrowError(NotFoundError);
      });

      it('should return detail thread correctly', async () => {
        // Arrange
        const newThread = new NewThread({
          id: 'thread-123',
          title: 'title',
          body: 'body',
          owner: 'user-123',
          date: '2021-08-08',
        });

        const expectedDetailThread = new DetailThread({
          id: 'thread-123',
          title: 'title',
          body: 'body',
          date: '2021-08-08',
          username: 'dicoding',
          comments: [],
        });

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        await ThreadsTableTestHelper.addThread(newThread);

        // Action
        const detailThread = await threadRepositoryPostgres.getThreadById('thread-123');

        // Assert
        expect(detailThread).toStrictEqual(expectedDetailThread);
      });
    });

    describe('verifyThreadAvailability function', () => {
      it('should throw NotFoundError when thread not available', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'title', body: 'body', owner: 'user-123' });

        // Action & Assert
        await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-999')).rejects.toThrowError(NotFoundError);
      });

      it('should not throw NotFoundError when thread available', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'title', body: 'body', owner: 'user-123' });

        // Action & Assert
        await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123')).resolves.not.toThrowError(NotFoundError);
      });
    });
  });
});
