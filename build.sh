#!/bin/bash

# Build script for Netlify
set -e

echo "Starting build process..."

# Install Hugo if not available
if ! command -v hugo &> /dev/null; then
    echo "Hugo not found, installing..."
    # Try to use the system Hugo first
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y hugo
    elif command -v brew &> /dev/null; then
        brew install hugo
    else
        # Download Hugo directly
        HUGO_VERSION="0.121.2"
        wget -O hugo.tar.gz "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz"
        tar -xzf hugo.tar.gz
        sudo mv hugo /usr/local/bin/
        rm hugo.tar.gz
    fi
fi

# Check Hugo version
hugo version

# Build the site
echo "Building Hugo site..."
hugo --minify --gc

echo "Build completed successfully!"

