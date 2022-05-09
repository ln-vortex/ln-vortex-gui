export default async function channelHandler({ query: { id } }, res) {
  const lnService = require('ln-service');

  const {lnd} = lnService.authenticatedLndGrpc({
    cert: process.env.cert,
    macaroon: process.env.macaroon,
    socket: process.env.socket,
  });

  // todo: handle errors
  const channel = await lnService.getChannel({id, lnd});

  res.status(200).json(channel);
}
