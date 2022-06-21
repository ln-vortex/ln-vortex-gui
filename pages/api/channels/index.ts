import axios from 'axios';

export default async function handler(req, res) {
  await axios
    .post(
      process.env.rpcUrl,
      {
        jsonrpc: '2.0',
        method: 'listchannels',
        id: +new Date(),
      },
      {
        auth: {
          username: process.env.rpcUser,
          password: process.env.rpcPassword,
        },
      }
    )
    .then(({ data }) => {
      res.status(200).json(data.result);
    })
    .catch(({ response }) => {
      // response.status ex = 401
      // response.responseText ex = unauthorized
      // response.data ex = The supplied authentication is invalid
      res.status(400).json(response.data);
    });
}
