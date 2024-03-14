const DetailReply = require("../DetailReply");

describe('DetailReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
      date: '2021-08-08T07:22:13.017Z',
      username: 'dicoding',
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      commentId: 'comment-123',
      content: 'abc',
      date: '2021-08-08T07:22:13.017Z',
      username: 'dicoding',
      is_deleted: false,
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailReply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'abc',
      date: '2021-08-08T07:22:13.017Z',
      username: 'dicoding',
      is_deleted: false,
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.commentId).toEqual(payload.commentId);
    expect(detailReply.content).toEqual(payload.content);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.username).toEqual(payload.username);
    expect(detailReply.is_deleted).toEqual(payload.is_deleted);
  });
});
