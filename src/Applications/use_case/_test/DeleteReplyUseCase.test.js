const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCaseParam = {
      replyId: 'reply-123',
    };

    const owner = 'user-123';

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkReplyIsExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCaseParam, owner);

    // Assert
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCaseParam.replyId, owner);
    expect(mockReplyRepository.checkReplyIsExist).toBeCalledWith(useCaseParam);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(useCaseParam.replyId);
  });
});
