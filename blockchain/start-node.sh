#!/bin/bash

# Akoya Moon Testnet Node Startup Script
echo "Starting Akoya Moon Testnet Node..."

# Initialize blockchain if not already initialized
if [ ! -d "./data/geth" ]; then
    echo "Initializing blockchain with genesis.json..."
    geth --datadir ./data init genesis.json
fi

# Start the node
geth --datadir ./data \
     --http \
     --http.addr 0.0.0.0 \
     --http.port 8545 \
     --http.corsdomain "*" \
     --http.api "admin,debug,web3,eth,txpool,personal,clique,miner,net" \
     --ws \
     --ws.addr 0.0.0.0 \
     --ws.port 8546 \
     --ws.origins "*" \
     --ws.api "admin,debug,web3,eth,txpool,personal,clique,miner,net" \
     --allow-insecure-unlock \
     --unlock "0xa1b2c3d4e5f67890123456789012345678901234" \
     --password ./password.txt \
     --mine \
     --miner.etherbase "0xa1b2c3d4e5f67890123456789012345678901234" \
     --networkid 17771 \
     --identity "AkoyaMoonTestnet" \
     --verbosity 3

echo "Node stopped."