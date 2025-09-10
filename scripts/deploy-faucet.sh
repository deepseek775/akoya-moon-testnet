#!/bin/bash

# Deploy Akoya Moon Faucet
echo "Deploying Akoya Moon Faucet..."

# Navigate to faucet directory
cd ../faucet

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if .env exists, if not create from example
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please update the .env file with your actual values before starting the faucet."
fi

# Start the faucet
echo "Starting faucet..."
npm start