const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator, dateGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
    this._dateGenerator = dateGenerator;
  }

  async checkReplyIsExist({ replyId, commentId, threadId }) {
    const query = {
      text: `SELECT replies.id FROM replies
             INNER JOIN comments ON replies.comment_id = comments.id
             WHERE replies.id = $1 AND comments.id = $2 AND comments.thread_id = $3`,
      values: [replyId, commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async addReply(newReply) {
    const { content, owner, commentId } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new this._dateGenerator().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, commentId, content, date, owner],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(replyId) {
    const query = {
      text: `UPDATE replies SET is_deleted = true WHERE id = $1 RETURNING id`,
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id, 
                    comments.id AS comment_id,
                    replies.content, 
                    replies.date, 
                    users.username,
                    replies.is_deleted
             FROM replies
             INNER JOIN comments ON replies.comment_id = comments.id
             INNER JOIN users ON replies.owner = users.id
             WHERE comments.thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => new DetailReply({ ...row, commentId: row.comment_id }));
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('anda bukan pemilik balasan ini');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
