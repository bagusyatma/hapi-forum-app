/* istanbul ignore file */
const ServerTestHelper = {
  async getCredential({ server, username = 'dicoding' }) {
    const userPayload = {
      username,
      password: 'secret',
    };

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: { ...userPayload, fullname: 'fullname' },
    });

    const responseAuthentication = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: { ...userPayload },
    });

    const user = JSON.parse(responseUser.payload);
    const authentication = JSON.parse(responseAuthentication.payload);

    return {
      userId: user.data.addedUser.id,
      accessToken: authentication.data.accessToken,
    };
  },
};
module.exports = ServerTestHelper;
