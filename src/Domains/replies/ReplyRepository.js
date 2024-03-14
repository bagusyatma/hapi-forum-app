class ReplyRepository {
  async checkReplyIsExist({ replyId, commentId, threadId }) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addReply(newReply) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReply(replyId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByThreadId(threadId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner(replyId, owner) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}
module.exports = ReplyRepository;
