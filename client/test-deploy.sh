#!/bin/bash

# This script builds and serves the application locally with the production configuration
# to test GitHub Pages deployment settings

echo "Building application with production settings..."
npm run build

echo "Starting local server to test the build..."
cd dist && npx serve --single
