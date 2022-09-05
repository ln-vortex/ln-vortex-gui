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
      let lightningCoordinator;
      const coordinators = data.result;
      for (const item in coordinators) {
        const coordinator = coordinators[item];
        if (coordinator.transactionTypes.includes('ChannelOpen')) {
          lightningCoordinator = coordinator;
          lightningCoordinator.name = item;
          break;
        }
      }
      if (lightningCoordinator) {
        res.status(200).json(lightningCoordinator);
      } else {
        res.status(400).json('No lightning coordinator found');
      }
    })
    .catch(({ response }) => {
      res.status(400).json(response.data);
    });
}
