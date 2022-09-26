import axios from 'axios';
import { rpcPassword, rpcUrl, rpcUser } from './credentials';

const postRequests = ['queuecoins', 'cancelcoins'];

export const rpcRequest = async (method: string, res: any, req?: any) => {
  await axios
    .post(
      rpcUrl(),
      {
        jsonrpc: '2.0',
        method: method,
        id: +new Date(),
        params: method === 'getstatus' ? req?.query : req?.body?.params,
      },
      {
        auth: {
          username: rpcUser(),
          password: rpcPassword(),
        },
      }
    )
    .then(({ data }) => {
      if (postRequests.includes(method)) {
        if (data.error) {
          res.status(400).json(data);
        } else {
          res.status(200).json(data);
        }
      } else {
        res.status(200).json(data.result);
      }
    })
    .catch(({ response }) => {
      res.status(400).json(response.data);
    });
};
