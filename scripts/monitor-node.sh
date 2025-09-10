#!/bin/bash

# Monitor Akoya Moon Testnet Node
echo "Monitoring Akoya Moon Testnet Node..."

# Check if node is running
if pgrep -x "geth" > /dev/null; then
    echo "Node is running."
    
    # Get basic node info
    curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' http://localhost:8545
    echo ""
    
    # Get block number
    curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":67}' http://localhost:8545
    echo ""
    
    # Get peer count
    curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":67}' http://localhost:8545
    echo ""
else
    echo "Node is not running. Please start it with ./start-node.sh"
fi