#!/bin/bash

# Simple and reliable build process
echo "Starting build process..."

# Upgrade pip first
pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt

# Verify Flask installation
python -c "import flask; print(f'Flask {flask.__version__} installed successfully')"

# Verify gunicorn installation  
python -c "import gunicorn; print(f'Gunicorn installed successfully')"

# Create necessary directories
mkdir -p static/images templates

echo "Build completed successfully!"