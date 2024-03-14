const CommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'comments',
  register: async (server, { container }) => {
    const handler = new CommentsHandler(container);
    server.route(routes(handler));
  },
};
