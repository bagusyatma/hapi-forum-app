class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, is_deleted, replies } = payload;
    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.is_deleted = is_deleted;
    this.replies = replies;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({ id, content, date, username, is_deleted, replies }) {
    return !id || !content || !date || !username || is_deleted === undefined || !replies;
  }

  _isPayloadNotMeetDataTypeSpecification({ id, content, date, username, is_deleted, replies }) {
    return typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof is_deleted !== 'boolean' || !Array.isArray(replies);
  }
}
module.exports = DetailComment;
