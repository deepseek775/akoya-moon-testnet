require('dotenv').config();

module.exports = {
  rpcUrl: process.env.RPC_URL || 'http://localhost:8545',
  faucetPrivateKey: process.env.FAUCET_PRIVATE_KEY,
  port: process.env.PORT || 3000,
  faucetAmount: process.env.FAUCET_AMOUNT || 100000,
  maxRequestsPerIp: process.env.MAX_REQUESTS_PER_IP || 5,
  timeWindow: process.env.TIME_WINDOW || 86400, // 24 hours in seconds
  chainId: 17771
};