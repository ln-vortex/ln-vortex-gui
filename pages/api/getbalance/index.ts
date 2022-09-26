import { rpcRequest } from '../../../utils/rpcRequest';

export default async function handler(req, res) {
  await rpcRequest('getbalance', res);
}
