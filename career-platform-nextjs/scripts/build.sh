#!/bin/bash

# Install dependencies
npm install

# Build Next.js application
npm run build

# Create output directory
mkdir -p .next/standalone

# Copy necessary files
cp -r .next/standalone/* .next/standalone/
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Create start script
echo "node server.js" > .next/standalone/start.sh
chmod +x .next/standalone/start.sh
