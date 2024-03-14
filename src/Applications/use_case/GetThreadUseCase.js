class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    thread.comments = comments.map(({ is_deleted, ...rest }) => (is_deleted ? { ...rest, content: '**komentar telah dihapus**' } : rest));

    for (let i = 0; i < thread.comments.length; i += 1) {
      thread.comments[i].replies = replies
        .filter((reply) => reply.commentId === thread.comments[i].id)
        .map((reply) => {
          const { commentId, is_deleted, ...rest } = reply;
          return is_deleted ? { ...rest, content: '**balasan telah dihapus**' } : rest;
        });
    }

    return thread;
  }
}

module.exports = GetThreadUseCase;
