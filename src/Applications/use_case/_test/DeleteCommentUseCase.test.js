const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const owner = 'user-123';

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentIsExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({ commentRepository: mockCommentRepository });

    // Action
    await deleteCommentUseCase.execute(useCaseParam, owner);

    // Assert
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCaseParam.commentId, owner);
    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith(useCaseParam);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCaseParam.commentId);
  });
});
