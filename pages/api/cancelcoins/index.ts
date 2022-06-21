import axios from 'axios';

export default async function handler(req, res) {
  await axios
    .post(
      process.env.rpcUrl,
      {
        jsonrpc: '2.0',
        method: 'cancelcoins',
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
      res.status(200).json(data);
    })
    .catch(({ response }) => {
      res.status(400).json(response.data);
    });
}
