# Adding Akoya Moon Testnet to MetaMask

## Manual Configuration

1. Open MetaMask and click on the network dropdown
2. Select "Add network"
3. Click "Add a network manually"
4. Enter the following details:

- **Network Name**: Akoya Testnet
- **RPC URL**: http://localhost:8545 (or your server IP)
- **Chain ID**: 17771
- **Currency Symbol**: AKM
- **Block Explorer URL**: (Leave blank for now)

## Automatic Configuration

You can add the network automatically by visiting our faucet website or using this code:

```javascript
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x456B', // 17771 in hexadecimal
    chainName: 'Akoya Testnet',
    nativeCurrency: {
      name: 'Akoya Moon',
      symbol: 'AKM',
      decimals: 18
    },
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: ['']
  }]
});