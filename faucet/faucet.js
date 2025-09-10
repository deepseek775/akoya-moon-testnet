const express = require('express');
const Web3 = require('web3');
const storage = require('node-persist');
const cors = require('cors');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const config = require('./config');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Web3
const web3 = new Web3(config.rpcUrl);
const FAUCET_AMOUNT = web3.utils.toWei(config.faucetAmount.toString(), 'ether');
const faucetAccount = web3.eth.accounts.privateKeyToAccount(config.faucetPrivateKey);
web3.eth.accounts.wallet.add(faucetAccount);

// Rate limiter
const rateLimiter = new RateLimiterMemory({
  points: config.maxRequestsPerIp,
  duration: config.timeWindow,
});

// Initialize storage
(async () => {
  await storage.init({
    dir: './storage',
    expiredInterval: 24 * 60 * 60 * 1000, // Clean up expired records daily
  });
  console.log('Faucet storage initialized');
})();

// Helper function to check if address has received coins
async function hasAddressReceivedCoins(address) {
  const normalizedAddress = address.toLowerCase();
  const received = await storage.getItem(normalizedAddress);
  return !!received;
}

// Helper function to mark address as having received coins
async function markAddressAsUsed(address) {
  const normalizedAddress = address.toLowerCase();
  await storage.setItem(normalizedAddress, {
    timestamp: Date.now(),
    amount: config.faucetAmount
  });
}

// Faucet API endpoint
app.post('/api/faucet', async (req, res) => {
  try {
    const { address } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Validate address
    if (!address || !web3.utils.isAddress(address)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid Ethereum address is required' 
      });
    }

    // Check rate limiting
    try {
      await rateLimiter.consume(clientIp);
    } catch (rateLimiterRes) {
      return res.status(429).json({ 
        success: false, 
        error: 'Too many requests. Please try again later.' 
      });
    }

    // Check if address already received coins
    if (await hasAddressReceivedCoins(address)) {
      return res.status(400).json({ 
        success: false, 
        error: 'This address has already received test coins' 
      });
    }

    // Get transaction parameters
    const nonce = await web3.eth.getTransactionCount(faucetAccount.address, 'pending');
    const gasPrice = await web3.eth.getGasPrice();

    // Create transaction object
    const txObject = {
      nonce: web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(gasPrice),
      to: address,
      value: FAUCET_AMOUNT,
      chainId: config.chainId
    };

    // Sign and send the transaction
    const signedTx = await web3.eth.accounts.signTransaction(txObject, config.faucetPrivateKey);
    const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    // Mark address as having received coins
    await markAddressAsUsed(address);

    // Return success response
    res.json({
      success: true,
      message: `Successfully sent ${config.faucetAmount} AKM test coins to ${address}`,
      transactionHash: txReceipt.transactionHash,
      amount: config.faucetAmount
    });

  } catch (error) {
    console.error('Faucet error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    const balance = await web3.eth.getBalance(faucetAccount.address);
    
    res.json({
      status: 'healthy',
      blockNumber: blockNumber,
      faucetBalance: web3.utils.fromWei(balance, 'ether'),
      networkId: config.chainId
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message 
    });
  }
});

// Get faucet address endpoint
app.get('/api/faucet-address', (req, res) => {
  res.json({
    address: faucetAccount.address
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`Akoya Moon Faucet API running on http://localhost:${config.port}`);
  console.log(`Faucet account: ${faucetAccount.address}`);
  console.log(`RPC URL: ${config.rpcUrl}`);
});