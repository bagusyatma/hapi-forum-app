const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
    };

    const useCaseParam = {
      threadId: 'thread-123',
    };

    const owner = 'user-123';

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'content',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() =>
      Promise.resolve(
        new AddedComment({
          id: 'comment-123',
          content: 'content',
          owner: 'user-123',
        }),
      ),
    );

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload, useCaseParam, owner);

    // Assert
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
      }),
    );

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCaseParam.threadId);
    expect(addedComment).toStrictEqual(expectedAddedComment);
  });
});
