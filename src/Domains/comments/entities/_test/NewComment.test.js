const NewComment = require("../NewComment");

describe('NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      content: 'abc',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'abc',
      owner: 'user-123',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
