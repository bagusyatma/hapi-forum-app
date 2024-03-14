const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
    };

    const useCaseParam = {
      commentId: 'comment-123',
    };

    const owner = 'user-123';

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'content',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockCommentRepository.checkCommentIsExist = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn(() =>
      Promise.resolve(
        new AddedReply({
          id: 'reply-123',
          content: 'content',
          owner: 'user-123',
        }),
      ),
    );

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload, useCaseParam, owner);

    // Assert
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({
        content: 'content',
        owner: 'user-123',
        commentId: 'comment-123',
      }),
    );

    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith(useCaseParam);
    expect(addedReply).toStrictEqual(expectedAddedReply);
  });
});
