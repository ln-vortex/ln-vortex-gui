import axios from 'axios';

export default async function handler(req, res) {
  await axios
    .post(
      process.env.rpcUrl,
      {
        jsonrpc: '2.0',
        method: 'getstatuses',
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
      const result = data.result;
      const statusArray = Object.keys(result).map((key) => [key, result[key]]);
      res.status(200).json(statusArray);
    })
    .catch(({ response }) => {
      res.status(400).json(response.data);
    });
}
