import axios from 'axios';

export default async function handler(req, res) {
  await axios
    .post(
      process.env.rpcUrl,
      {
        jsonrpc: '2.0',
        method: 'cancelcoins',
        id: +new Date(),
        params: req.body.params,
      },
      {
        auth: {
          username: process.env.rpcUser,
          password: process.env.rpcPassword,
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
