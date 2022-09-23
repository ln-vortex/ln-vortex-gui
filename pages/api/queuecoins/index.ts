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
        method: 'queuecoins',
        id: +new Date(),
        params: req.body.params,
      },
      {
        auth: {
          username: rpcUser(),
          password: rpcPassword(),
        },
      }
    )
    .then(({ data }) => {
      if (data.error) {
        res.status(400).json(data);
      } else {
        res.status(200).json(data);
      }
    })
    .catch(({ response }) => {
      res.status(400).json(response.data);
    });
}
