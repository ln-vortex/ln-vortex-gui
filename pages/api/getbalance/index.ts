import axios from 'axios';
import {
    rpcUrl,
    rpcUser,
    rpcPassword,
} from '../../../utils/credentials';

export default async function handler(req, res) {
  await axios
    .post(
      rpcUrl(),
      {
        jsonrpc: '2.0',
        method: 'getbalance',
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
      res.status(200).json(data.result);
    })
    .catch(({ response }) => {
      res.status(400).json(response.data);
    });
}
