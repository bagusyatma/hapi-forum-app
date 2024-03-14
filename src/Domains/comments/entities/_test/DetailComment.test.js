const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
      date: '2021-08-08T07:22:13.017Z',
      username: 'dicoding',
      replies: [],
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'abc',
      date: '2021-08-08T07:22:13.017Z',
      username: 'dicoding',
      is_deleted: false,
      replies: [],
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'abc',
      date: '2021-08-08T07:22:13.017Z',
      username: 'dicoding',
      is_deleted: false,
      replies: [],
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.is_deleted).toEqual(payload.is_deleted);
    expect(detailComment.replies).toEqual(payload.replies);
  });
});
