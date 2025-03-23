#!/bin/bash

# CoAI Project Setup Script
# This script helps set up the development environment for the CoAI project

echo "Setting up CoAI Platform Development Environment..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v16 or later."
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi

# Install dependencies
echo "Installing project dependencies..."
npm install

# Check for Solana CLI
if ! command -v solana &> /dev/null; then
    echo "Solana CLI is not installed."
    echo "To install Solana CLI, follow the instructions at: https://docs.solana.com/cli/install-solana-cli-tools"
fi

# Create environment files if they don't exist
if [ ! -f "./frontend/.env" ]; then
    echo "Creating frontend environment file..."
    cp ./frontend/.env.example ./frontend/.env
    echo "Please update ./frontend/.env with your specific configuration."
fi

if [ ! -f "./backend/.env" ]; then
    echo "Creating backend environment file..."
    cp ./backend/.env.example ./backend/.env
    echo "Please update ./backend/.env with your specific configuration."
fi

# Setup complete
echo "Setup complete! You can now start developing the CoAI platform."
echo "To start the frontend: npm run start:frontend"
echo "To start the backend: npm run start:backend"
echo "To run tests: npm test" 