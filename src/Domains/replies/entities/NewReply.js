class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { commentId, content, owner } = payload;

    this.commentId = commentId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({ commentId, content, owner }) {
    return !commentId || !content || !owner;
  }

  _isPayloadNotMeetDataTypeSpecification({ commentId, content, owner }) {
    return typeof commentId !== 'string' || typeof content !== 'string' || typeof owner !== 'string';
  }
}
module.exports = NewReply;
