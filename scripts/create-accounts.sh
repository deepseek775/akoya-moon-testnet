#!/bin/bash

# Create accounts for Akoya Moon Testnet
echo "Creating accounts for Akoya Moon Testnet..."

# Create directory if it doesn't exist
mkdir -p ../blockchain/accounts

# Create faucet account
echo "Creating faucet account..."
geth --datadir ../blockchain/accounts account new --password ../blockchain/password.txt

# Create validator account
echo "Creating validator account..."
geth --datadir ../blockchain/accounts account new --password ../blockchain/password.txt

echo "Accounts created successfully!"
echo "Please update the genesis.json file with the actual addresses."