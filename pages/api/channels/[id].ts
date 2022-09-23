import axios from 'axios';
import {
    rpcUrl,
    rpcUser,
    rpcPassword,
} from '../../../utils/credentials';

export default async function channelHandler({ query: { id } }, res) {
  await axios
    .post(
      rpcUrl(),
      {
        jsonrpc: '2.0',
        method: 'listchannels',
        id: +new Date(),
      },
      {
        auth: {
          username: rpcUser(),
          password: rpcPassword(),
        },
      }
    )
    .then(({ data }) => {
      const channel = data.result.find((c) => c.shortChannelId === id);
      res.status(200).json(channel);
    })
    .catch(({ response }) => {
      // response.status ex = 401
      // response.responseText ex = unauthorized
      // response.data ex = The supplied authentication is invalid
      res.status(400).json(response.data);
    });
}
