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
      let onChainCoordinator;
      const coordinators = data.result;
      for (const item in coordinators) {
        const coordinator = coordinators[item];
        if (coordinator.transactionTypes.includes('OnChain')) {
          onChainCoordinator = coordinator;
          break;
        }
      }
      if (onChainCoordinator) {
        res.status(200).json(onChainCoordinator);
      } else {
        res.status(400).json('No on chain coordinator found');
      }
    })
    .catch(({ response }) => {
      res.status(400).json(response.data);
    });
}
