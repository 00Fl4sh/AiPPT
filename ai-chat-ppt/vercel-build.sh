#!/bin/bash

# Navigate to client directory
cd client

# Install dependencies
npm install

# Build the React app
npm run build

# The build output will be in client/build
echo "Build completed successfully!"
