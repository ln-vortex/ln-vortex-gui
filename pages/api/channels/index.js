export default async function handler(req, res) {
  const lnService = require('ln-service');
  
  const {lnd} = lnService.authenticatedLndGrpc({
    cert: process.env.cert,
    macaroon: process.env.macaroon,
    socket: process.env.socket,
  });

  const channels = (await lnService.getChannels({lnd})).channels;
  
  res.status(200).json(channels);
}