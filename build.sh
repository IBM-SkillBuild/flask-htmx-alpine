#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Create necessary directories if they don't exist
mkdir -p static/images
mkdir -p templates

echo "Build completed successfully!"