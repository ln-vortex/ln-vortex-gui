import axios from 'axios';

export default async function handler(req, res) {
  /* below test data added while coordinator isn't connecting, delete once coordinator is back online
  const data = {
    id: 1,
    result: {
      'Taproot Testnet': {
        round: {
          version: 0,
          roundId:
            'e548251b54698f93148b986b2872a5de361c5b8738426bb4067b86d2874650dc',
          amount: 40000,
          coordinatorFee: 1000,
          publicKey:
            'e64bc6142987ea48e96293b37b719a8cb00fc4a4673c3c4e48df30bb9dbed602',
          time: 1662234806,
          inputType: 'witness_v1_taproot',
          outputType: 'witness_v1_taproot',
          changeType: 'witness_v1_taproot',
          minPeers: 1,
          maxPeers: 2,
          status: '',
          feeRate: 1,
        },
        status: 'KnownRound',
        transactionTypes: ['OnChain'],
      },
      'Lightning Testnet': {
        round: {
          version: 0,
          roundId:
            'e216bf2256d7824fd369c5148d25204f08d97bed173461ac460c7654f5570550',
          amount: 200000,
          coordinatorFee: 1000,
          publicKey:
            'e64bc6142987ea48e96293b37b719a8cb00fc4a4673c3c4e48df30bb9dbed602',
          time: 1662234802,
          inputType: 'witness_v0_keyhash',
          outputType: 'witness_v0_scripthash',
          changeType: 'witness_v0_keyhash',
          minPeers: 1,
          maxPeers: 2,
          status: '',
          feeRate: 1,
        },
        status: 'KnownRound',
        transactionTypes: ['ChannelOpen'],
      },
    },
    error: null,
  };
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
  */

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
