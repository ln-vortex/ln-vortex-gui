module.exports = {
  env: {
    rpcUrl: process.env.VORTEX_RPC_URL,
    rpcUser: process.env.VORTEX_RPC_USER,
    rpcPassword: process.env.VORTEX_RPC_PASSWORD,
  },
  output: 'standalone',
};
