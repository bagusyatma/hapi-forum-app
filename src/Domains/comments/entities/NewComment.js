class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { threadId, content, owner } = payload;

    this.threadId = threadId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({ threadId, content, owner }) {
    return !threadId || !content || !owner;
  }

  _isPayloadNotMeetDataTypeSpecification({ threadId, content, owner }) {
    return typeof threadId !== 'string' || typeof content !== 'string' || typeof owner !== 'string';
  }
}
module.exports = NewComment;
