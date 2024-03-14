const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator, dateGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._dateGenerator = dateGenerator;
  }

  async checkCommentIsExist({ commentId, threadId }) {
    const query = {
      text: `SELECT id FROM comments WHERE id = $1 AND thread_id = $2`,
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async addComment(newComment) {
    const { content, owner, threadId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new this._dateGenerator().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, content, date, owner],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId) {
    const query = {
      text: `UPDATE comments SET is_deleted = true WHERE id = $1 RETURNING id`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, 
                    comments.content, 
                    comments.date, 
                    users.username,
                    comments.is_deleted
             FROM comments
             INNER JOIN users ON comments.owner = users.id
             WHERE comments.thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => new DetailComment({ ...row, replies: [] }));
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: `SELECT * FROM comments WHERE id = $1 AND owner = $2`,
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('anda bukan pemilik komentar ini');
    }
  }
}

module.exports = CommentRepositoryPostgres;
