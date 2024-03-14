class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam, owner) {
    await this._replyRepository.checkReplyIsExist(useCaseParam);
    await this._replyRepository.verifyReplyOwner(useCaseParam.replyId, owner);
    await this._replyRepository.deleteReply(useCaseParam.replyId);
  }
}

module.exports = DeleteReplyUseCase;
