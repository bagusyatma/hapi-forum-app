const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123',
    };

    const expectedThread = new DetailThread({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2021-08-08',
      username: 'dicoding',
      comments: [],
    });

    const expectedComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08',
        content: 'content',
        is_deleted: false,
        replies: [],
      }),
    ];

    const expectedReplies = [
      new DetailReply({
        id: 'reply-123',
        commentId: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08',
        content: 'content',
        is_deleted: false,
      }),
    ];

    const { is_deleted: commentIsDeleted, ...filteredCommentDetails } = expectedComments[0];
    const { commentId: commentIdReply, is_deleted: replyIsDeleted, ...filteredReplyDetails } = expectedReplies[0];

    const expectedCommentsWithReplies = [
      {
        ...filteredCommentDetails,
        replies: [filteredReplyDetails],
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new DetailThread({
          id: 'thread-123',
          title: 'title',
          body: 'body',
          date: '2021-08-08',
          username: 'dicoding',
          comments: [],
        }),
      ),
    );
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        new DetailComment({
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08',
          content: 'content',
          is_deleted: false,
          replies: [],
        }),
      ]),
    );
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        new DetailReply({
          id: 'reply-123',
          commentId: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08',
          content: 'content',
          is_deleted: false,
        }),
      ]),
    );

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCaseParam);

    // Assert
    expect(thread).toEqual(new DetailThread({ ...expectedThread, comments: expectedCommentsWithReplies }));

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParam.threadId);
  });

  it('should return thread with deleted comment and deleted reply', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123',
    };

    const expectedThread = new DetailThread({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2021-08-08',
      username: 'dicoding',
      comments: [],
    });

    const expectedComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08',
        content: 'content',
        is_deleted: true,
        replies: [],
      }),
    ];

    const expectedReplies = [
      new DetailReply({
        id: 'reply-123',
        commentId: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08',
        content: 'content',
        is_deleted: true,
      }),
    ];

    const { is_deleted: commentIsDeleted, ...filteredCommentDetails } = expectedComments[0];
    const { commentId: commentIdReply, is_deleted: replyIsDeleted, ...filteredReplyDetails } = expectedReplies[0];

    const expectedCommentsWithReplies = [
      {
        ...filteredCommentDetails,
        content: commentIsDeleted ? '**komentar telah dihapus**' : 'content',
        replies: [filteredReplyDetails].map((reply) => (replyIsDeleted ? { ...reply, content: '**balasan telah dihapus**' } : reply)),
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new DetailThread({
          id: 'thread-123',
          title: 'title',
          body: 'body',
          date: '2021-08-08',
          username: 'dicoding',
          comments: [],
        }),
      ),
    );
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        new DetailComment({
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08',
          content: 'content',
          is_deleted: true,
          replies: [],
        }),
      ]),
    );
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        new DetailReply({
          id: 'reply-123',
          commentId: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08',
          content: 'content',
          is_deleted: true,
        }),
      ]),
    );

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCaseParam);

    // Assert
    expect(thread).toEqual(new DetailThread({ ...expectedThread, comments: expectedCommentsWithReplies }));

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParam.threadId);
  });
});
