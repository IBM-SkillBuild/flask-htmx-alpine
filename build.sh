#!/bin/bash

# Install dependencies with cache optimization
pip install --cache-dir /tmp/pip-cache --upgrade pip
pip install --cache-dir /tmp/pip-cache -r requirements.txt

# Create necessary directories if they don't exist
mkdir -p static/images
mkdir -p templates

# Pre-compile Python files for faster startup
python -m compileall . || echo "Compilation warnings ignored"

# Verify critical files exist
if [ ! -f "app.py" ]; then
    echo "ERROR: app.py not found!"
    exit 1
fi

echo "Build completed successfully!"