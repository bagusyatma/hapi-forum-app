const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };

    const owner = 'user-123';

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'title',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedThread({
          id: 'thread-123',
          title: 'title',
          owner: 'user-123',
        }),
      ),
    );

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload, owner);

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: expectedAddedThread.owner,
      }),
    );

    expect(addedThread).toStrictEqual(expectedAddedThread);
  });
});
