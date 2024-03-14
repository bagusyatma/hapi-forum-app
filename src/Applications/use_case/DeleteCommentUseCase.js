class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam, owner) {
    await this._commentRepository.checkCommentIsExist(useCaseParam);
    await this._commentRepository.verifyCommentOwner(useCaseParam.commentId, owner);
    await this._commentRepository.deleteComment(useCaseParam.commentId);
  }
}

module.exports = DeleteCommentUseCase;
