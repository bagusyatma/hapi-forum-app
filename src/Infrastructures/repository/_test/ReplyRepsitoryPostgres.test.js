const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepository domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {}, {});
    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepositoryPostgres);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
    });

    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('checkReplyIsExist function', () => {
      it('should not throw error when reply found', async () => {
        // Arrange
        await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        // Action & Assert
        await expect(replyRepositoryPostgres.checkReplyIsExist({ replyId: 'reply-123', commentId: 'comment-123', threadId: 'thread-123' })).resolves.not.toThrowError(NotFoundError);
      });

      it('should throw NotFoundError when reply not found', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        // Action & Assert
        await expect(replyRepositoryPostgres.checkReplyIsExist({ replyId: 'reply-123', commentId: 'comment-123', threadId: 'thread-123' })).rejects.toThrowError(NotFoundError);
      });
    });

    describe('addReply function', () => {
      it('should persist add reply and return added reply correctly', async () => {
        // Arrange
        const newReply = {
          content: 'content',
          owner: 'user-123',
          commentId: 'comment-123',
        };

        function fakeIdGenerator() {
          return '123'; // stub!
        }

        function fakeDateGenerator() {
          this.toISOString = () => '2021-08-08'; // stub!
        }

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator, fakeDateGenerator);

        // Action
        const addedReply = await replyRepositoryPostgres.addReply(newReply);

        // Assert
        const replies = await RepliesTableTestHelper.findReplyById('reply-123');

        expect(addedReply).toStrictEqual(
          new AddedReply({
            id: 'reply-123',
            content: newReply.content,
            owner: newReply.owner,
          }),
        );

        expect(replies).toHaveLength(1);
      });
    });

    describe('deleteReply function', () => {
      it('should persist delete reply', async () => {
        // Arrange
        await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        // Action
        await replyRepositoryPostgres.deleteReply('reply-123');

        // Assert
        const replies = await RepliesTableTestHelper.findReplyById('reply-123');
        expect(replies[0].is_deleted).toEqual(true);
      });

      it('should throw NotFoundError when reply not found', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        // Action & Assert
        await expect(replyRepositoryPostgres.deleteReply('reply-123')).rejects.toThrowError(NotFoundError);
      });
    });

    describe('getRepliesByThreadId function', () => {
      it('should return replies correctly', async () => {
        // Arrange
        const expectedReplies = new DetailReply({
          id: 'reply-123',
          commentId: 'comment-123',
          content: 'content',
          username: 'dicoding',
          date: '2021-08-08',
          is_deleted: false,
        });

        await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', content: 'content', owner: 'user-123', date: '2021-08-08' });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        // Action
        const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

        // Assert
        expect(replies).toHaveLength(1);
        expect(replies).toStrictEqual([expectedReplies]);
      });

      it('should return reply is deleted', async () => {
        // Arrange
        const expectedReplies = new DetailReply({
          id: 'reply-123',
          commentId: 'comment-123',
          content: 'content',
          username: 'dicoding',
          date: '2021-08-08',
          is_deleted: true,
        });

        await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', content: 'content', owner: 'user-123', date: '2021-08-08', isDeleted: true });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        // Action
        const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

        // Assert
        expect(replies).toHaveLength(1);
        expect(replies).toStrictEqual([expectedReplies]);
      });

      it('should return empty array when no replies', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        // Action
        const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

        // Assert
        expect(replies).toHaveLength(0);
      });
    });

    describe('verifyReplyOwner function', () => {
      it('should not throw error when owner is valid', async () => {
        // Arrange
        await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        // Action & Assert
        await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
      });

      it('should throw AuthorizationError when owner is invalid', async () => {
        // Arrange
        await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        // Action & Assert
        await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-124')).rejects.toThrowError(AuthorizationError);
      });
    });
  });
});
