class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, commentId, username, date, content, is_deleted } = payload;
    this.id = id;
    this.commentId = commentId;
    this.username = username;
    this.date = date;
    this.content = content;
    this.is_deleted = is_deleted;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({ id, commentId, username, date, content, is_deleted }) {
    return !id || !commentId || !username || !date || !content || is_deleted === undefined;
  }

  _isPayloadNotMeetDataTypeSpecification({ id, commentId, username, date, content, is_deleted }) {
    return typeof id !== 'string' || typeof commentId !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof is_deleted !== 'boolean';
  }
}
module.exports = DetailReply;
